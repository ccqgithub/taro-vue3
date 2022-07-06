import { PropType } from 'vue';
import { TypeFromProps } from '@/utils';

export const IModalProps = {
  visible: {
    type: Boolean,
    default: false
  },
  title: {
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
  // 透明度，用在多个弹窗重叠时，隐藏后面的 0 - 1
  opacity: {
    type: Number,
    default: 1
  }
};

export type ModalProps = TypeFromProps<typeof IModalProps>;
