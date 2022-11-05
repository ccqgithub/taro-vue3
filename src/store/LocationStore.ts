import { reactive, toRefs } from 'vue';
import { defineStore } from 'pinia';
import { InjectionContext } from 'pinia-di';
import Taro, {
  showModal,
  getSetting,
  openSetting,
  getLocation as taroGetLocation,
  startLocationUpdate,
  offLocationChange,
  stopLocationUpdate
} from '@tarojs/taro';
import { debug, normalizeError } from '@/utils';
import { i18n } from '@/i18n';

export type TPoint = { latitude: number; longitude: number };

export const LocationStore = ({ useStoreId }: InjectionContext) => {
  return defineStore(useStoreId('LocationStore'), () => {
    const { t } = i18n.global;
    // 毫秒：缓存最少有效时间，如果请求可以使用缓存，在这个期间内则使用缓存
    // 缓存30秒
    const cacheMinValidTime = 30000;
    const state = reactive({
      // gcj02
      locationLoading: false,
      location: null as TPoint | null,
      locationGetTime: 0,
      // store gps
      gpsLoading: false,
      gps: null as TPoint | null,
      gpsGetTime: 0,
      // 监听位置权限
      listeningLocation: false,
      // 是否授权
      auth: false
    });

    const checkAuth = async () => {
      try {
        const setting = await getSetting();
        const authRequested =
          typeof setting.authSetting['scope.userLocation'] !== 'undefined';
        const hasAuth = !!setting.authSetting['scope.userLocation'];

        state.auth = hasAuth;

        return {
          hasAuth,
          requested: authRequested
        };
      } catch (e) {
        normalizeError(e, {}, 'checkAuth');
        state.auth = false;
        return {
          hasAuth: false,
          requested: false
        };
      }
    };

    // 授权
    const checkAndQuestAuth = async (requestAuth = false) => {
      try {
        const setting = await getSetting();
        const authRequested =
          typeof setting.authSetting['scope.userLocation'] !== 'undefined';

        // 已经授权过了
        if (setting.authSetting['scope.userLocation']) {
          state.auth = true;
          return true;
        }

        // 第一次需要请求授权
        if (!authRequested) {
          try {
            await Taro.authorize({ scope: 'scope.userLocation' });
            state.auth = true;
            return true;
          } catch (e) {
            normalizeError(e, {}, 'checkAndQuestAuth');
            state.auth = false;
            return false;
          }
        }

        // 不请求授权
        if (!requestAuth) {
          state.auth = false;
          return false;
        }

        // 确认授权
        const modalRes = await showModal({
          title: t('modal.allowLocationAccessTitle'),
          content: t('modal.allowLocationAccessDesc')
        });

        // 取消授权
        if (!modalRes.confirm) {
          state.auth = false;
          return false;
        }

        // 授权设置
        const result = await openSetting();
        if (result.authSetting['scope.userLocation']) {
          state.auth = true;
          return true;
        }
      } catch (e) {
        normalizeError(e, {}, 'checkAndQuestAuth');
      }

      state.auth = false;
      return false;
    };

    // get location
    const getMPLocation = async (
      args: {
        type?: string;
        // 是否请求授权, 为 false 时，如果为授权则返回 null
        requestAuth?: boolean;
        isHighAccuracy?: boolean;
        highAccuracyExpireTime?: number;
      } = {}
    ) => {
      const {
        type = 'gcj02',
        requestAuth = false,
        isHighAccuracy = false,
        highAccuracyExpireTime = 3000
      } = args;

      const hasAuth: boolean = await checkAndQuestAuth(requestAuth);
      if (!hasAuth) return null;

      // getLocation
      try {
        const location: TPoint | null = await taroGetLocation({
          type,
          isHighAccuracy,
          highAccuracyExpireTime
        });
        debug('get location success', [type, location]);
        return location;
      } catch (e) {
        normalizeError(e, {}, 'getMPLocation');
        debug('get location fail', [type, e]);
        return null;
      }
    };

    // gcj02
    const getLocation = async (
      args: {
        // 是否使用之前的缓存
        useCache?: boolean;
        // 调用失败使用旧值
        useFallback?: boolean;
        // 是否请求授权, 为 false 时，如果为授权则返回 null
        requestAuth?: boolean;
        isHighAccuracy?: boolean;
        highAccuracyExpireTime?: number;
      } = {}
    ) => {
      const { hasAuth, requested } = await checkAuth();
      if (!hasAuth && requested && !args.requestAuth) return null;

      const { locationGetTime } = state;
      const { useCache = true, useFallback = true } = args;
      const expired = Date.now() - locationGetTime > cacheMinValidTime;

      if (state.location && useCache && !expired) {
        return state.location;
      }

      state.locationLoading = true;
      try {
        let location: TPoint | null = await getMPLocation({
          type: 'gcj02',
          requestAuth: args.requestAuth,
          isHighAccuracy: args.isHighAccuracy,
          highAccuracyExpireTime: args.highAccuracyExpireTime || 3000
        });
        let getTime = Date.now();

        // fallback
        if (!location && useFallback) {
          location = state.location;
          getTime = state.locationGetTime;
        }

        state.location = location;
        state.locationGetTime = getTime;
        state.locationLoading = false;

        return location;
      } catch (e) {
        normalizeError(e, {}, 'getLocation');
        state.locationLoading = false;
        return useFallback ? state.location : null;
      }
    };

    // gcj02
    const getGps = async (
      args: {
        // 是否使用之前的缓存
        useCache?: boolean;
        // 调用失败使用旧值
        useFallback?: boolean;
        // 是否请求授权, 为 false 时，如果为授权则返回 null
        requestAuth?: boolean;
        isHighAccuracy?: boolean;
        highAccuracyExpireTime?: number;
      } = {}
    ) => {
      const { hasAuth, requested } = await checkAuth();
      if (!hasAuth && requested && !args.requestAuth) return null;

      const { gpsGetTime } = state;
      const { useCache = true, useFallback = true } = args;
      const expired = Date.now() - gpsGetTime > cacheMinValidTime;

      if (state.gps && useCache && !expired) {
        return state.gps;
      }

      state.gpsLoading = true;
      try {
        let location: TPoint | null = await getMPLocation({
          type: 'wgs84',
          requestAuth: args.requestAuth,
          isHighAccuracy: args.isHighAccuracy,
          highAccuracyExpireTime: args.highAccuracyExpireTime || 3000
        });
        let getTime = Date.now();

        // fallback
        if (!location && useFallback) {
          location = state.gps;
          getTime = state.gpsGetTime;
        }

        state.gps = location;
        state.gpsGetTime = getTime;
        state.gpsLoading = false;

        return location;
      } catch (e) {
        normalizeError(e, {}, 'getGps');
        state.gpsLoading = false;
        return useFallback ? state.gps : null;
      }
    };

    const initLocation = async () => {
      await getGps({ requestAuth: true });
      if (state.auth) {
        await getLocation({ isHighAccuracy: true });
      }
    };

    const updateLocation = (latitude: number, longitude: number) => {
      state.location = { latitude, longitude };
    };

    const onLocationChangeCallback = (
      e: Taro.onLocationChange.CallbackResult | TaroGeneral.CallbackResult
    ) => {
      if (!e) return;
      const { latitude, longitude } = e as Taro.onLocationChange.CallbackResult;
      if (latitude && longitude) updateLocation(latitude, longitude);
    };

    const toggleListeningLocation = (v: boolean) => {
      state.listeningLocation = v;
    };

    const onAppLocationChange = () => {
      try {
        startLocationUpdate({
          success: () => {
            toggleListeningLocation(true);
            Taro.onLocationChange(onLocationChangeCallback);
          }
        });
      } catch (e) {
        normalizeError(e, {}, 'onAppLocationChange');
      }
    };

    const stopListenLocationChange = () => {
      offLocationChange(onLocationChangeCallback);
      stopLocationUpdate({
        success: () => {
          toggleListeningLocation(false);
        }
      });
    };

    return {
      ...toRefs(state),
      getLocation,
      getGps,
      initLocation,
      toggleListeningLocation,
      onAppLocationChange,
      stopListenLocationChange
    };
  });
};
