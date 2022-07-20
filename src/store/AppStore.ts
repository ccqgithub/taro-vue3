import { getGlobalStore } from './globalStore';
import { computed, markRaw, reactive, Ref, ref, toRefs } from 'vue';
import queryString from 'query-string';
import { defineStore } from 'pinia';
import { InjectionContext } from 'pinia-di';
import Taro from '@tarojs/taro';
import { getConfig } from '@/config';
import { getRoutePath, AppRoutes } from '@/app.config';
import { GeneralError, normalizeError, randomKey } from '@/utils';
import { ToastItem, ToastConfig, ConfirmModalProps } from '@/components';
import { StorageKeys, getSystemInfo, getMenuButtonInfo } from '@/constants';
import {
  getUserInfo as apiGetUserInfo,
  LoginResp,
  loginByCode,
  loginByPhone
} from '@/service';
import { User, AppEnv, IToken } from '@/types';
import { LocationStore, eventBus, EventKeys } from '@/store';

type ConfirmProps = Omit<ConfirmModalProps, 'visible'>;

// token 版本号，用来强制清除登录状态
const loginTokenVersion = 1;

export const AppStore = ({ useStoreId, getStore }: InjectionContext) => {
  const locationStore = getStore(LocationStore);
  // 系统信息
  const systemInfo = getSystemInfo();
  // 胶囊信息
  const menuButtonInfo = getMenuButtonInfo();
  // token
  let token: IToken | null = null;
  try {
    const tokenVersion =
      Taro.getStorageSync(StorageKeys.LOGIN_TOKEN_VERSION) || 0;
    if (loginTokenVersion !== Number(tokenVersion)) {
      Taro.setStorageSync(StorageKeys.LOGIN_TOKEN_VERSION, loginTokenVersion);
      Taro.removeStorageSync(StorageKeys.LOGIN_TOKEN);
    } else {
      const storageToken = Taro.getStorageSync(StorageKeys.LOGIN_TOKEN);
      if (storageToken) {
        token = JSON.parse(storageToken) as IToken;
      }
    }
  } catch (e) {}

  return defineStore(useStoreId('app'), () => {
    // states
    const state = reactive({
      // 登录用户
      loginToken: token,
      // 用户信息
      userInfo: null,
      // 是否前台
      isShow: false,
      isInited: false,
      // errors:
      errors: [],
      // toast
      toastList: [],
      // confirm modals
      confirmModals: new Map()
    }) as {
      loginToken: IToken | null;
      userInfo: User | null;
      isShow: boolean;
      isInited: boolean;
      errors: GeneralError[];
      // toast
      toastList: ToastItem[];
      // confirmModals
      confirmModals: Map<
        string,
        {
          props: ConfirmProps;
          cancel: () => void;
          ok: () => void;
          unmount: () => void;
          visibleRef: Ref<boolean>;
        }
      >;
    };
    // getters
    const dataInited = computed(() => {
      return state.isInited;
    });
    const isLogin = computed(() => {
      if (!state.isInited) return false;
      return !!state.loginToken;
    });
    // actions
    const setIsShow = (v: boolean) => {
      state.isShow = v;
    };
    // login status
    const setUserInfo = (v: Partial<User>) => {
      state.userInfo = state.userInfo
        ? { ...state.userInfo, ...v }
        : (v as User);
    };
    const getUserInfo = async () => {
      try {
        const userInfo = await apiGetUserInfo();
        setUserInfo(userInfo);
        return state.userInfo;
      } catch (error: any) {
        showToast({ title: error.message, icon: 'none' });
      }
    };
    const setToken = (token: IToken | null) => {
      state.loginToken = token;
      if (token) {
        Taro.setStorageSync(StorageKeys.LOGIN_TOKEN, JSON.stringify(token));
      } else {
        Taro.removeStorageSync(StorageKeys.LOGIN_TOKEN);
      }
    };
    const clearLogin = () => {
      setToken(null);
      state.userInfo = null;
    };
    const clearLoginAndReLaunch = () => {
      clearLogin();
      Taro.reLaunch({
        url: '/pages/index/index'
      });
    };
    // init
    const init = async () => {
      try {
        await Promise.all([locationStore.initLocation(), login()]);
        state.isInited = true;
      } catch (error) {
        console.log(error);
        const err = normalizeError(error);
        showToast({ title: err.message, icon: 'none' });
        state.errors.push(err);
      }
    };
    // login
    const login = async () => {
      // 静默登录
      const res = await loginByCode();
      if (res) {
        setToken(res);
        await getUserInfo();
      } else {
        clearLogin();
      }
    };
    // 出错是刷新
    const refreshAll = async () => {
      state.errors = [];
      // init
      if (!state.isInited) {
        await init();
        return;
      }
    };
    // check login session
    const checkSession = async () => {
      try {
        await Taro.checkSession();
        return true;
      } catch (e: any) {
        // 网络错误不需要判断为登录过期
        if (/Failed to fetch/i.test(e.errMsg || '')) {
          return;
        }
        // 登录过期
        clearLogin();
        return false;
      }
    };
    // 检查更新
    const checkVersion = () => {
      const updateManager = Taro.getUpdateManager();
      updateManager.onUpdateReady(function () {
        Taro.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        });
      });
    };
    // login promise
    const loginPromise = (params: Record<string, string> = {}) => {
      return new Promise<boolean>((resove, reject) => {
        Taro.navigateTo({
          url: `${getRoutePath(AppRoutes.login)}?${queryString.stringify(
            params
          )}`,
          success: () => {
            eventBus.once(EventKeys.LoginBack, (v = {}) => {
              resove(!!v.suecess);
            });
          },
          fail: (error) => {
            reject(normalizeError(error));
          }
        });
      });
    };
    // change api env
    const changeApiEnv = (env: AppEnv) => {
      const lastEnv = getConfig().appEnv;
      if (lastEnv === env) return;
      Taro.setStorageSync(StorageKeys.API_ENV, env);
      clearLogin();
      state.isInited = false;
      refreshAll();
      Taro.reLaunch({
        url: '/pages/index/index'
      });
    };
    // toast
    const setToasts = (toasts: ToastItem[]) => {
      state.toastList = toasts;
    };

    const removeToast = (key: string) => {
      const index = state.toastList.findIndex((item) => item.key === key);
      if (index !== -1) state.toastList.splice(index, 1);
    };

    const showToast = (config: ToastConfig | string) => {
      const v: ToastConfig =
        typeof config === 'string'
          ? {
              icon: 'none',
              title: config
            }
          : config;
      const key = randomKey('toast');
      state.toastList.push({
        ...v,
        key
      });
    };

    // confirm modal
    const confirm = (props: ConfirmProps) => {
      const key = randomKey('confirmModal');
      const visibleRef = ref(true);
      return new Promise<boolean>((resolve) => {
        state.confirmModals.set(
          key,
          markRaw({
            props: {
              ...props
            },
            visibleRef,
            cancel: () => resolve(false),
            ok: () => resolve(true),
            unmount: () => {
              state.confirmModals.delete(key);
            }
          })
        );
      });
    };

    return {
      ...toRefs(state),
      dataInited,
      isLogin,
      setIsShow,
      setUserInfo,
      getUserInfo,
      setToken,
      clearLogin,
      clearLoginAndReLaunch,
      init,
      login,
      refreshAll,
      checkSession,
      checkVersion,
      loginPromise,
      changeApiEnv,
      setToasts,
      showToast,
      removeToast,
      confirm
    };
  });
};
