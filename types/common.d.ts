import { SlotProps } from '@tarojs/components';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      slot: SlotProps & {
        [key: string]: any;
      };
    }
  }
}
