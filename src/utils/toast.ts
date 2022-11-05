import { ToastConfig } from '@/components';
import { getGlobalStore } from '@/store/globalStore';

export const showToast = (v: string | ToastConfig) => {
  return getGlobalStore()?.showToast(v);
};
