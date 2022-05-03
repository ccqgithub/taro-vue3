import { PropType } from 'vue';
import { TypeFromProps } from '@/utils';

export const VNavBarProps = {
  class: {
    type: String,
    default: undefined
  },
  // MAIN: tab页，标题大，居左
  // SUB：子页面，标题小，居中
  type: {
    type: String as PropType<'MAIN' | 'SUB'>,
    default: 'SUB'
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
  },
  // 是否渲染占位区域：因为navbar是fixed定位，所以添加占位区域给滚动区域
  placeholder: {
    type: String,
    default: ''
  },
  // fixed 定位
  fixed: {
    type: Boolean,
    default: false
  }
};

export type NavBarProps = TypeFromProps<typeof VNavBarProps>;
