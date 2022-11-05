import { PropType } from 'vue';
import { TypeFromProps } from '@/types';
import { i18n } from '@/i18n';

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
    default: () => i18n.global.t('com.cancel')
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
  // ok
  ok: {
    type: Boolean,
    default: true
  },
  okText: {
    type: String,
    default: ''
  },
  okDisabled: {
    type: Boolean,
    default: false
  },
  customOk: {
    type: Boolean,
    default: true
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
  // 安全高度： 高度不包含安全区域
  safeHeight: {
    type: Boolean,
    default: false
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
  hidden: {
    type: Boolean,
    default: false
  },
  // background:
  background: {
    type: String,
    default: '#ffffff'
  },
  // loading
  loading: {
    type: Boolean,
    default: false
  },
  // 动画完成后再显示
  hideWhenAnimate: {
    type: Boolean,
    default: true
  }
};

export type PopupProps = TypeFromProps<typeof IPopupProps>;
