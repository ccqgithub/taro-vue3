import { AppStore } from '@/store/AppStore';
import type { ConfirmProps } from '@/store/AppStore';

type GlobalStore = ReturnType<ReturnType<typeof AppStore>>;

// 全局用的 store
let _globalStore: GlobalStore | null = null;

export const setGlobakStore = (store: GlobalStore) => {
  _globalStore = store;
};

export const getGlobalStore = () => {
  return _globalStore;
};

export type { ConfirmProps };
