import Taro from '@tarojs/taro';
import { getConfig } from '@/config';

export const getMenuButtonInfo = () => {
  if (getConfig().isWeapp) return Taro.getMenuButtonBoundingClientRect();
  return {
    width: window.innerWidth,
    height: 40,
    top: 0,
    bottom: 40,
    left: 0,
    right: 0
  };
};

export const getSystemInfo = () => {
  return Taro.getSystemInfoSync();
};

export const getStatusBarHeight = (min = 0, max = 0) => {
  let result = min;
  try {
    const res = Taro.getSystemInfoSync();
    if (res?.statusBarHeight && res?.statusBarHeight > min)
      result = res?.statusBarHeight;
  } catch (e) {}
  return Math.max(max, result);
};
