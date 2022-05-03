import { getGlobalStore } from '@/store';
import { ConfirmModalProps } from '@/components';

export const confirm = (props: ConfirmModalProps): Promise<boolean> => {
  const globalStore = getGlobalStore();
  if (!globalStore) return Promise.resolve(false);
  return globalStore.confirm(props);
};
