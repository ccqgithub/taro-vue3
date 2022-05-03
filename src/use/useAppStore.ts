import { useStore } from 'pinia-di';
import { AppStore } from '@/store';

export const useAppStore = () => {
  return useStore(AppStore);
};
