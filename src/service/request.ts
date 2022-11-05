import Taro from '@tarojs/taro';
import { getConfig } from '@/config';
import { joinUrl } from '@/utils/url';
import { GeneralError, ErrorType, normalizeError } from '@/utils/error';
import { debug } from '@/utils/debug';
import { getGlobalStore } from '@/store/globalStore';
import { i18n } from '@/i18n';

export type IToken = {
  accessToken?: string;
  refreshToken?: string;
  expireIn: number;
  newUser?: boolean;
};

// 是否有 refresh token 逻辑
const USE_REFRESH_TOKEN = false;
export const ServerErrMsg = '抱歉，服务器出错。请稍后再试。';
const checkIsRefreshToken = (url = '') => url.indexOf('/token') !== -1;
const checkIsLoginByCode = (url = '') => url.indexOf('/login-by-code') !== -1;

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
  // 已经刷新过token，不需要再刷新
  hasRefreshToken?: boolean;
  // token
  token?: IToken;
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

export const loginByCode = async () => {
  try {
    const { code } = await Taro.login();
    console.log(code);
    return Promise.resolve<any>({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'ACCESS_TOKEN',
      expireIn: 7200
    });
    // return request.post<LoginResp>({
    //   url: '/login',
    //   data: params,
    //   noToken: true
    // });
  } catch (e: any) {
    if (e.info?.code === 401) {
      return null;
    }
    throw e;
  }
};

const request = {
  async taroRequest<T>(params: IRequestParams, method = 'GET'): Promise<T> {
    const globalStore = getGlobalStore()!;
    const loginToken = globalStore.loginToken || params.token;
    const { apiBaseUrl } = getConfig();
    const { noToken = false } = params;
    const isRefreshToken = checkIsRefreshToken(params?.url);
    const isLoginByCode = checkIsLoginByCode(params.url);
    const retryCount = params.retryCount || 0;

    if (params.token) {
      delete params['token'];
    }

    // 正在刷新token, 共用 refresh token 的请求
    if (refreshTokenPromise && !isRefreshToken && !isLoginByCode && !noToken) {
      return refreshTokenPromise.then(() => {
        // 刷新成功
        return request.taroRequest<T>(
          {
            ...params,
            hasRefreshToken: true
          },
          method
        );
      });
    }

    const language = i18n.global.locale.value;
    const {
      url,
      data,
      contentType = 'application/json',
      replaceBaseUrl,
      hasRefreshToken = false
    } = params;
    // headers
    const headers: Record<string, string> = {
      'content-type': contentType,
      'accept-language': language,
      'ngrok-skip-browser-warning': '*'
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
      const { data: resData } = res;
      const isSuccessCode = res.statusCode >= 200 && res.statusCode < 300;
      const is401 = res.statusCode === 401;
      const is404 = res.statusCode === 404;
      const is409 = res.statusCode === 409;

      debug('request success', [
        `[${res.statusCode}] ${option.url}`,
        option,
        res
      ]);

      // error code
      if (!isSuccessCode) {
        // not 401
        if (!is401 || isRefreshToken || hasRefreshToken) {
          let type = ErrorType.API_ERROR;
          if (is404) {
            type = ErrorType.NOT_FOUND;
          }
          if (is409) {
            type = ErrorType.STATE_CONFLICT;
          }

          return Promise.reject(
            new GeneralError(
              (resData as any).message ||
                (resData as any).error ||
                ServerErrMsg,
              {
                type,
                info: {
                  params,
                  method,
                  statusCode: res.statusCode,
                  res: resData
                }
              },
              'api'
            )
          );
        }
        if (isLoginByCode) {
          return null as any;
        }
        // 401
        // 已经在刷新token
        if (refreshTokenPromise) {
          return refreshTokenPromise.then(() => {
            return request.taroRequest<T>(
              {
                ...params,
                hasRefreshToken: true
              },
              method
            );
          });
        }
        // 未登录，或者不需要refresh token
        if (!loginToken) {
          globalStore.clearLogin();
          return Promise.reject(
            new GeneralError(
              '登录过期',
              {
                type: ErrorType.UN_AUTHORIZED,
                info: {
                  params,
                  method,
                  statusCode: res.statusCode,
                  res: res.data
                }
              },
              'api'
            )
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
        const promise = Promise.resolve()
          .then(() => {
            if (USE_REFRESH_TOKEN) {
              return request
                .post<IToken>({
                  url: 'mini-program/v1/token',
                  noToken: true,
                  data: {
                    refreshToken: loginToken.refreshToken
                  }
                })
                .catch(() => loginByCode());
            }
            return loginByCode();
          })
          .catch((e) => {
            reject && reject(e);
            globalStore.clearLogin();
            throw new GeneralError(
              '登录过期',
              {
                type: ErrorType.UN_AUTHORIZED,
                info: {
                  params,
                  method
                }
              },
              'api'
            );
          })
          .then((v) => {
            globalStore.setToken(v);
            resolve && resolve(v);
            return request.taroRequest<T>(
              {
                ...params,
                hasRefreshToken: true
              },
              method
            );
          });

        return promise;
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
        normalizeError(
          '请检查您的网络设置后重试',
          {
            type: ErrorType.NET_WORK,
            info: {
              params,
              method
            }
          },
          'api'
        )
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
