import { useStore } from 'pinia-di';
import { LocationStore } from '@/store';

export const useLocationStore = () => {
  return useStore(LocationStore);
};
