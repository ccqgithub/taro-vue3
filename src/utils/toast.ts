import { ToastConfig } from '@/components';
import { getGlobalStore } from '@/store';

export const showToast = (v: string | ToastConfig) => {
  return getGlobalStore()?.showToast(v);
};
