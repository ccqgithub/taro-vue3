import { PropType } from 'vue';
import { TypeFromProps } from '@/types';
import { i18n } from '@/i18n';

export const IConfirmModalProps = {
  visible: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
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
  // show ok button
  ok: {
    type: Boolean,
    default: true
  },
  okText: {
    type: String,
    default: () => i18n.global.t('com.sure')
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
  okClick: {
    type: Function as PropType<() => boolean | Promise<boolean>>,
    default: () => true
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
  // 透明度，用在多个弹窗重叠时，隐藏后面的 0 - 1
  hidden: {
    type: Boolean,
    default: false
  },
  // open type
  openType: {
    type: String,
    default: undefined
  },
  openTypeClick: {
    type: Function as PropType<(v: any) => void>,
    default: () => {}
  }
};

export type ConfirmModalProps = TypeFromProps<typeof IConfirmModalProps>;
