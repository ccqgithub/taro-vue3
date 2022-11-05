import { PropType } from 'vue';
import { TypeFromProps } from '@/types';

export type ToastConfig = {
  title: string;
  duration?: number;
  icon?: 'success' | 'none';
};

export type ToastItem = ToastConfig & {
  key: string;
  page: string;
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
