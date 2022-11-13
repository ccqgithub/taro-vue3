import { ref, onMounted, onUnmounted } from 'vue';

export const useMounted = () => {
  const isMounted = ref(false);

  onMounted(() => {
    isMounted.value = true;
  });

  onUnmounted(() => {
    isMounted.value = false;
  });

  return isMounted;
};
