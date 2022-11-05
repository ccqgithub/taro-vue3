import { getGlobalStore, ConfirmProps } from '@/store/globalStore';

export const confirm = async (props: ConfirmProps) => {
  const globalStore = getGlobalStore();
  if (!globalStore) return false;
  return globalStore.confirm(props);
};
