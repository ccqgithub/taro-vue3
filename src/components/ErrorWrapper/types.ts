import { CSSProperties, PropType } from 'vue';
import { GeneralError, TypeFromProps } from '@/utils';

export const VErrorWrapperProps = {
  error: {
    type: Object as PropType<GeneralError | null>,
    default: null
  },
  class: {
    type: String,
    default: undefined
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: undefined
  }
};

export type ErrorWrapperProps = TypeFromProps<typeof VErrorWrapperProps>;
