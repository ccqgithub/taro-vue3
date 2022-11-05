import { Ref, ref, onMounted, onUnmounted, watchEffect } from 'vue';
import Taro from '@tarojs/taro';

export const useBrightness = (
  args: {
    visible?: Ref<boolean>;
  } = {}
) => {
  const useMount = !args.visible;
  const visible = args.visible ?? ref(false);
  const brightness = ref(0);

  onMounted(() => {
    if (useMount) {
      visible.value = true;
    }

    const stopWatch = watchEffect(async () => {
      // show
      if (visible.value) {
        const res = await Taro.getScreenBrightness();
        brightness.value = res.value;
        Taro.setScreenBrightness({ value: 0.8 });
        return;
      }
      // hide
      if (brightness.value !== 0) {
        Taro.setScreenBrightness({ value: brightness.value });
      }
    });

    onUnmounted(() => {
      stopWatch();
    });
  });

  onUnmounted(() => {
    if (useMount) {
      visible.value = false;
    }
  });
};
