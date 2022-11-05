import { createApp, onBeforeMount, watchEffect } from 'vue';
import Taro from '@tarojs/taro';
import { createPinia } from 'pinia';
import { useProvideStores } from 'pinia-di';
import { i18n } from '@/i18n';
import {
  AppStore,
  LocationStore,
  setGlobakStore,
  getGlobalStore
} from '@/store';
import { getLayout, normalizeError } from '@/utils';
import './app.scss';

(Taro as any).options.debug = false;

// page data interceptor
const oldPage = Page;
const layout = getLayout();
Page = (opts: Record<string, any>) => {
  const appInited = getGlobalStore()?.dataInited || false;

  const data = {
    ...(opts.data || {}),
    glb: {
      topBarHeight: layout.topBarHeight,
      appInited,
      loaded: false,
      ready: false
    }
  };

  oldPage({
    ...opts,
    data
  });
};

const App = createApp({
  setup() {
    const { getStore } = useProvideStores({
      stores: [AppStore, LocationStore]
    });
    const appStore = getStore(AppStore);
    setGlobakStore(appStore);

    watchEffect(() => {
      const appInited = appStore.dataInited;

      // mark page loaded to skeleton.wxml
      const page = Taro.getCurrentPages().pop();
      (page as any)?.setData({
        'glb.appInited': appInited
      });
    });

    onBeforeMount(() => {
      appStore.init();
    });
  }
});

App.use(createPinia());
App.use(i18n);

App.config.errorHandler = (err, instance, info) => {
  normalizeError(err, { info }, 'errorHandler');
  console.log(err);
};

Taro.onError((err) => {
  normalizeError(err, {}, 'onError');
  console.log(err);
});

Taro.onUnhandledRejection((reason) => {
  normalizeError(reason, {}, 'onUnhandledRejection');
  console.log(reason);
});

export default App;
