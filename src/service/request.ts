import Taro from '@tarojs/taro';
import { getConfig } from '@/config';
import {
  joinUrl,
  debug,
  GeneralError,
  ErrorType,
  normalizeError
} from '@/utils';
import { loginByCode } from '@/service';
import { getGlobalStore } from '@/store';
import { i18n } from '@/i18n';
import { IToken } from '@/types';

// 是否有 refresh token 逻辑
const USE_REFRESH_TOKEN = true;
export const ServerErrMsg = '抱歉，服务器出错。请稍后再试。';
const checkIsRefreshToken = (url = '') => url.indexOf('refresh-token') !== -1;

// refresh token 最大尝试次数
const refreshTokenRetryCount = 5;
let refreshTokenPromise: Promise<any> | null = null;

interface IRequestParams {
  url: string;
  data?: FormData | { [key: string]: any } | string;
  // 不加 token
  noToken?: boolean;
  contentType?: string;
  replaceBaseUrl?: string;
  retryCount?: number;
}

export type SuccessCallbackResult<T> = {
  data: T;
  header: Record<string, any>;
  statusCode: number;
  errMsg: string;
};

type OptionType = {
  url: string;
  data?: object | string;
  method?: any;
  header: object;
  mode?: 'no-cors' | 'cors' | 'same-origin';
};

const request = {
  async taroRequest<T>(params: IRequestParams, method = 'GET'): Promise<T> {
    const { apiBaseUrl } = getConfig();
    const { noToken = false } = params;
    const isRefreshToken = checkIsRefreshToken(params?.url);
    const retryCount = params.retryCount || 0;

    // 正在刷新token, 共用 refresh token 的请求
    if (refreshTokenPromise && !isRefreshToken && !noToken) {
      return refreshTokenPromise.then(() => {
        // 刷新成功
        return request.taroRequest<T>(params, method);
      });
    }

    const globalStore = getGlobalStore()!;
    const { loginToken } = globalStore;
    const language = i18n.global.locale.value;
    const {
      url,
      data,
      contentType = 'application/json',
      replaceBaseUrl
    } = params;
    // headers
    const headers: Record<string, string> = {
      'content-type': contentType,
      'accept-language': language
    };
    // auth token
    if (loginToken && !noToken) {
      headers['Authorization'] = `Bearer ${loginToken.accessToken}`;
    }
    // 当接口参数 Object 对象中不包含 success/fail/complete 时将默认返回 promise，否则仍按回调方式执行，无返回值。
    const option: OptionType = {
      url: replaceBaseUrl
        ? `${joinUrl(replaceBaseUrl, url)}`
        : `${joinUrl(apiBaseUrl, url)}`,
      data: data,
      method: method,
      header: headers
    };

    try {
      const res = await Taro.request<T>(option);
      debug('request success', [
        `[${res.statusCode}] ${option.url}`,
        option,
        res
      ]);

      const isSuccessCode = res.statusCode >= 200 && res.statusCode < 300;

      // refresh token
      if (isRefreshToken) {
        // refresh token 请求成功
        if (isSuccessCode) {
          globalStore.setToken(res.data as unknown as IToken);
          return res.data;
        }
        // token刷新失败，登录
        const loginRes = await loginByCode().then((v) => {
          if (v) {
            globalStore.setToken(v);
            return globalStore.getUserInfo();
          }
          // refresh token 尝试失败，清除登录状态
          globalStore.clearLogin();
          return Promise.reject(
            new GeneralError('登录过期', { type: ErrorType.UN_AUTHORIZED })
          );
        });
        return loginRes as unknown as T;
      }

      // 登录过期 / 未登录
      if (res.statusCode === 401) {
        // 已经在刷新token
        if (refreshTokenPromise) {
          return refreshTokenPromise.then(() => {
            return request.taroRequest<T>(params, method);
          });
        }
        // 未登录，或者不需要refresh token
        if (!loginToken || !USE_REFRESH_TOKEN) {
          globalStore.clearLogin();
          return await Promise.reject(
            new GeneralError('登录过期', { type: ErrorType.UN_AUTHORIZED })
          );
        }
        // 其他接口等等 refresh token 完成再调用
        let resolve: (v: any) => void;
        let reject: (v: any) => void;
        refreshTokenPromise = new Promise((rs, rj) => {
          resolve = (v) => {
            rs(v);
            refreshTokenPromise = null;
          };
          reject = (e) => {
            rj(e);
            refreshTokenPromise = null;
          };
        });
        // 登录过期，刷新token
        const promise = request
          .post<IToken>({
            url: '/v1/refresh-token',
            noToken: true,
            data: {
              refreshToken: loginToken.refreshToken
            }
          })
          .then((v) => {
            resolve && resolve(v);
            return request.taroRequest<T>(params, method);
          })
          .catch((e) => {
            reject && reject(e);
            throw e;
          });
        return promise;
      }

      // 其他业务逻辑错误
      if (!isSuccessCode) {
        const { data: resData } = res;
        return Promise.reject(
          new GeneralError(
            (resData as any).message || (resData as any).error || ServerErrMsg,
            {
              info: resData
            }
          )
        );
      }

      return res.data;
    } catch (e) {
      debug('request error', [option.url, option, e]);
      if (isRefreshToken && retryCount < refreshTokenRetryCount) {
        return request.taroRequest<T>(
          {
            ...params,
            retryCount: retryCount + 1
          },
          method
        );
      }
      return Promise.reject(
        normalizeError('请检查您的网络设置后重试', { type: ErrorType.NET_WORK })
      );
    }
  },
  get<T>(params: IRequestParams) {
    return request.taroRequest<T>(params, 'GET');
  },
  post<T>(params: IRequestParams) {
    return request.taroRequest<T>(params, 'POST');
  },
  put<T>(params: IRequestParams) {
    return request.taroRequest<T>(params, 'PUT');
  },
  delete<T>(params: IRequestParams) {
    return request.taroRequest<T>(params, 'DELETE');
  }
};

export { request };
