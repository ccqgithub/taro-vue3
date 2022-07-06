import { PropType } from 'vue';
import { TypeFromProps } from '@/utils';

export const IPopupProps = {
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  scrollY: {
    type: Boolean,
    default: true
  },
  // show cancel button
  cancel: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: '取消'
  },
  cancelIcon: {
    type: String as PropType<'CLOSE' | 'BACK' | 'DOWN'>,
    default: 'CLOSE'
  },
  cancelDisabled: {
    type: Boolean,
    default: false
  },
  // 自定义 cancel 按钮逻辑
  customCancel: {
    type: Boolean,
    default: false
  },
  // show ok button
  ok: {
    type: Boolean,
    default: true
  },
  okText: {
    type: String,
    default: '确定'
  },
  okDisabled: {
    type: Boolean,
    default: false
  },
  // 自定义ok按钮逻辑
  customOk: {
    type: Boolean,
    default: false
  },
  // show mask
  mask: {
    type: Boolean,
    default: true
  },
  maskClose: {
    type: Boolean,
    default: true
  },
  zIndex: {
    type: Number,
    default: undefined
  },
  // 弹窗距离顶部间隙
  gap: {
    type: Number,
    default: 0
  },
  // 内容高度
  height: {
    type: [Number, String] as PropType<'100%' | number>,
    default: undefined
  },
  // custom header
  customHeader: {
    type: Boolean,
    default: false
  },
  // custom header height
  customHeaderHeight: {
    type: Number,
    default: 0
  },
  // 透明度，用在多个弹窗重叠时，隐藏后面的 0 - 1
  opacity: {
    type: Number,
    default: 1
  }
};

export type PopupProps = TypeFromProps<typeof IPopupProps>;
