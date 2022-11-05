import { PropType } from 'vue';
import { GeneralError } from '@/utils';
import { TypeFromProps } from '@/types';

export const VErrorWrapperProps = {
  error: {
    type: Object as PropType<GeneralError | null>,
    default: null
  }
};

export type ErrorWrapperProps = TypeFromProps<typeof VErrorWrapperProps>;
