import {
  computed,
  markRaw,
  reactive,
  Ref,
  ref,
  toRefs,
  watchEffect
} from 'vue';
import queryString from 'query-string';
import { defineStore } from 'pinia';
import { InjectionContext } from 'pinia-di';
import Taro from '@tarojs/taro';
import { getConfig } from '@/config';
import { getRoutePath } from '@/app.config';
import { randomKey } from '@/utils/str';
import { GeneralError, normalizeError } from '@/utils/error';
import { ToastItem, ToastConfig, ConfirmModalProps } from '@/components';
import { StorageKeys, getSystemInfo } from '@/constants';
import { getUserInfo as apiGetUserInfo, loginByCode } from '@/service';
import { UserInfo, AppEnv, IToken } from '@/types';
import { eventBus } from '@/store/eventBus';

export type ConfirmProps = Omit<ConfirmModalProps, 'visible'> & {
  closeSignalRef?: Ref<boolean>;
};

export type ConfirmModalRecord = {
  page: string;
  props: ConfirmProps;
  cancel: (v?: false) => void;
  ok: (v?: Taro.UserInfo) => void;
  unmount: () => void;
  hide: () => void;
  visibleRef: Ref<boolean>;
  onVisibleChange?: (v: boolean) => void;
};

const sysInfo = getSystemInfo();
// token 版本号，用来强制清除登录状态
const loginTokenVersion = 1;

export const AppStore = ({ useStoreId }: InjectionContext) => {
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
  } catch (e) {
    normalizeError(e, {}, 'AppStore.token');
  }

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
      confirmModals: new Map(),
      // win
      winWidth: sysInfo.windowWidth,
      winHeight: sysInfo.windowHeight
    }) as {
      loginToken: IToken | null;
      userInfo: UserInfo | null;
      isShow: boolean;
      isInited: boolean;
      errors: GeneralError[];
      // toast
      toastList: ToastItem[];
      // confirmModals
      confirmModals: Map<string, ConfirmModalRecord>;
      // win
      winWidth: number;
      winHeight: number;
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
    const setUserInfo = (v: Partial<UserInfo>) => {
      state.userInfo = state.userInfo
        ? { ...state.userInfo, ...v }
        : (v as UserInfo);
    };
    const getUserInfo = async (token?: IToken) => {
      try {
        const userInfo = await apiGetUserInfo(token);
        console.log(userInfo);
        setUserInfo(userInfo);
        return state.userInfo;
      } catch (e: any) {
        const error = normalizeError(e, {}, 'getUserInfo');
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
        await Promise.all([login()]);
        state.isInited = true;
      } catch (error) {
        const err = normalizeError(error, {}, 'AppStore.init');
        showToast({ title: err.message, icon: 'none' });
        state.errors.push(err);
      }
    };
    // login
    const login = async () => {
      if (state.loginToken) return;
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
        const err = normalizeError(e, {}, 'checkSession');
        // 网络错误不需要判断为登录过期
        if (/Failed to fetch/i.test(err.message)) {
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
          url: `${getRoutePath('login')}?${queryString.stringify(params)}`,
          success: () => {
            eventBus.once('LoginBack', (v = {}) => {
              resove(!!v.suecess);
            });
          },
          fail: (error) => {
            reject(normalizeError(error, {}, 'loginPromise'));
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
      const page = (Taro.getCurrentPages().pop()?.route || '').replace(
        /^\//,
        ''
      );
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
        page,
        key
      });
    };

    // confirm modal
    const confirm = (props: ConfirmProps) => {
      const key = randomKey('confirmModal');
      const visibleRef = ref(true);
      const stopWatch = watchEffect(() => {
        if (props.closeSignalRef && props.closeSignalRef.value === true) {
          visibleRef.value = false;
        }
      });

      return new Promise<boolean | undefined>((resolve) => {
        const page = (Taro.getCurrentPages().pop()?.route || '').replace(
          /^\//,
          ''
        );

        state.confirmModals.set(
          key,
          markRaw({
            props: {
              ...props
            },
            page,
            visibleRef,
            cancel: (v) => resolve(v),
            ok: () => resolve(true),
            unmount: () => {
              state.confirmModals.delete(key);
            },
            hide: () => {
              state.confirmModals.delete(key);
            },
            onVisibleChange: (v) => {
              if (!v) {
                stopWatch();
              }
            }
          })
        );
      });
    };

    const unmountPage = (p: string) => {
      // remove modals
      const keys: string[] = [];

      for (const [key, val] of state.confirmModals) {
        if (val.page === p) {
          keys.push(key);
        }
      }

      for (const key of keys) {
        state.confirmModals.delete(key);
      }

      // remove toast
      state.toastList = state.toastList.filter((v) => {
        return v.page !== p;
      });
    };

    const reLaunch = async () => {
      state.isInited = false;
      clearLogin();
      await Taro.reLaunch({
        url: getRoutePath('space')
      });
      init();
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
      confirm,
      reLaunch,
      unmountPage
    };
  });
};
