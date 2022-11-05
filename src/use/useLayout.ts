import { reactive } from 'vue';
import Taro from '@tarojs/taro';
import { getLayout } from '@/utils';

export const layout = reactive(getLayout()) as ReturnType<typeof getLayout>;

Taro.onWindowResize(() => {
  const newLayout = getLayout();
  const keys = Object.keys(newLayout);
  for (const key of keys) {
    (layout as any)[key] = (newLayout as any)[key];
  }
});

export const useLayout = () => {
  return layout;
};
