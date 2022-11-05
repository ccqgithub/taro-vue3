import { PropType } from 'vue';
import { TypeFromProps } from '@/types';
import { NavBarProps } from '@/components';

export const VPageWrapperProps = {
  // 自定义顶部导航
  customNav: {
    type: Boolean,
    default: true
  },
  // 顶部导航属性
  nav: {
    type: Object as PropType<NavBarProps>,
    default: undefined
  },
  // 是否是 tab 页面
  tab: {
    type: Boolean,
    default: false
  },
  // 是否是 tab 页面
  auth: {
    type: Boolean,
    default: false
  },
  // loading
  loading: {
    type: Boolean,
    default: false
  }
};

export const VPageLayoutProps = {
  // 顶部导航属性
  nav: {
    type: Object as PropType<NavBarProps>,
    default: undefined
  },
  // 是否是 tab 页面
  tab: {
    type: Boolean,
    default: false
  },
  // loading
  loading: {
    type: Boolean,
    default: false
  },
  // nav show after ready
  waitReady: {
    type: Boolean,
    default: false
  }
};

export type PageWrapperProps = TypeFromProps<typeof VPageWrapperProps>;
export type pageLayoutProps = TypeFromProps<typeof VPageLayoutProps>;
