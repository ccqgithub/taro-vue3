import { watchEffect, onMounted } from 'vue';
import { usePage } from '@/use/usePage';

export const useReady = (fn: () => void) => {
  const { isReady } = usePage();

  onMounted(() => {
    watchEffect(() => {
      if (!isReady.value) return;
      Promise.resolve().then(() => {
        fn();
      });
    });
  });
};
