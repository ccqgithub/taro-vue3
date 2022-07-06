import { PropType } from 'vue';
import { TypeFromProps } from '@/utils';

export type ToastConfig = {
  title: string;
  duration?: number;
  icon?: 'success' | 'error' | 'none';
};

export type ToastItem = ToastConfig & {
  key: string;
};

export const IToastProps = {
  icon: {
    type: String as PropType<Exclude<ToastItem['icon'], undefined>>,
    default: 'none'
  },
  duration: {
    type: Number,
    default: 3000
  },
  title: {
    type: String,
    default: ''
  }
};

export type ToastProps = TypeFromProps<typeof IToastProps>;
