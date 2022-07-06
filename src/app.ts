import { createApp, onMounted } from 'vue';
import { createPinia } from 'pinia';
import { useProvideStores } from 'pinia-di';
import { i18n } from '@/i18n';
import { AppStore, LocationStore, setGlobakStore } from '@/store';
import './app.scss';

const App = createApp({
  setup() {
    const { getStore } = useProvideStores({
      stores: [AppStore, LocationStore]
    });
    const appStore = getStore(AppStore);
    setGlobakStore(appStore);

    onMounted(() => {
      appStore.init();
    });
  }
});

App.use(createPinia());
App.use(i18n);

export default App;
