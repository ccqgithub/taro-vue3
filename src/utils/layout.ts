import { getSystemInfoSync } from '@tarojs/taro';
import { getMenuButtonInfo } from '@/constants';

// 获取布局信息
export const getLayout = (args: { bottomGap?: boolean } = {}) => {
  const { bottomGap = true } = args;
  const systemInfo = getSystemInfoSync();
  const menuButtonInfo = getMenuButtonInfo();
  const memuBarGap = menuButtonInfo.top - systemInfo.statusBarHeight!;
  const memuBarHeight =
    menuButtonInfo.height + (bottomGap ? memuBarGap * 2 : memuBarGap);
  const topBarHeight = memuBarHeight + menuButtonInfo.top - memuBarGap;

  // safeArea
  const { screenHeight, screenWidth } = systemInfo;
  const { left, right, top, bottom } = systemInfo.safeArea!;

  return {
    systemInfo,
    menuButtonInfo,
    statusBarHeight: systemInfo.statusBarHeight,
    topBarHeight,
    memuBarHeight,
    memuBarGap,
    safeArea: {
      left,
      top,
      right: screenWidth - right,
      bottom: screenHeight - bottom
    }
  };
};

export const getPopupLayout = (
  args: {
    safeHeight?: boolean;
    // popup height
    height?: number | '100%';
    // popup header height
    headerHeight?: number;
    // the min gap that the popup top
    gap?: number;
    customNav?: boolean;
  } = {}
) => {
  const {
    safeHeight = false,
    headerHeight = 52,
    customNav = false,
    gap = 0,
    height = 0
  } = args;
  const {
    systemInfo,
    topBarHeight,
    safeArea: inset
  } = getLayout({ bottomGap: true });
  let maxHeight = customNav
    ? systemInfo.windowHeight - topBarHeight - gap
    : systemInfo.windowHeight - gap;
  maxHeight =
    !height || height === '100%'
      ? maxHeight
      : Math.min(maxHeight, safeHeight ? height + inset.bottom : height);
  const maxContentHeight = maxHeight - inset.bottom - headerHeight;
  const contentHeight = height ? maxContentHeight : 'auto';

  const res = {
    // box 最大高度
    maxHeight,
    // 内容区最大高度， maxHeight 除去 header 和 safe area
    maxContentHeight,
    // 内容区实际设置的高度
    contentHeight
  };

  return res;
};
