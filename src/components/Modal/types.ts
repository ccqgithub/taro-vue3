import { TypeFromProps } from '@/types';
import { i18n } from '@/i18n';

export const IModalProps = {
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
  cancelDisabled: {
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
  // loading
  loading: {
    type: Boolean,
    default: false
  }
};

export type ModalProps = TypeFromProps<typeof IModalProps>;
