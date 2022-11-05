import { watchEffect } from 'vue';
import { usePage } from '@/use/usePage';

export const useLoaded = (fn: () => void) => {
  const { isLoaded } = usePage();

  watchEffect(() => {
    if (!isLoaded.value) return;
    Promise.resolve().then(() => {
      fn();
    });
  });
};
