import { watchEffect } from 'vue';
import { usePage } from '@/use/usePage';
import { useMounted } from '@/use/useMounted';

export const useReady = (fn: () => void) => {
  const { isReady } = usePage();
  const isMounted = useMounted();

  watchEffect(() => {
    if (!isMounted.value) return;
    if (!isReady.value) return;
    Promise.resolve().then(() => {
      fn();
    });
  });
};
