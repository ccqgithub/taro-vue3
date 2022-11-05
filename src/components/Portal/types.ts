import { Component, PropType } from 'vue';
import { TypeFromProps } from '@/types';

export type PortalItem<
  P extends Record<string, any> = Record<string, any>,
  C = Component<P>
> = {
  key: string;
  component: C;
  props: P;
  page: string;
};

export type ContextValue = {
  setPortal: ((v: PortalItem) => void) | null;
  removePortal: ((key: string) => void) | null;
};

export const VPortalProps = {
  props: {
    type: Object as PropType<Record<string, string>>,
    default: () => {}
  },
  component: {
    type: Object as PropType<Component>,
    required: true as const
  }
};

export type PortalProps = TypeFromProps<typeof VPortalProps>;
