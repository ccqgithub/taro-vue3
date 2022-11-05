import { PropType } from 'vue';
import { TypeFromProps } from '@/types';

export const VNavBarProps = {
  // main: tab页
  // sub
  pageType: {
    type: String as PropType<'main' | 'sub'>,
    default: 'sub'
  },
  // 类型
  type: {
    type: String as PropType<'default' | 'fixed' | 'simple'>,
    default: 'default'
  },
  // 颜色类型
  colorType: {
    type: String as PropType<'black' | 'light'>,
    default: 'light'
  },
  // 标题区域, 有 title 则不显示 children
  title: {
    type: String,
    default: ''
  },
  // 是否显示返回按钮
  back: {
    type: Boolean,
    default: undefined
  },
  // 是否显示首页按钮
  home: {
    type: Boolean,
    default: undefined
  }
};

export type NavBarProps = TypeFromProps<typeof VNavBarProps>;
