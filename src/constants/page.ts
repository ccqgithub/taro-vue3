import { InjectionKey, VNode } from 'vue';

export type PageContextValue = {
  state: {
    hasTab: boolean;
    customNav: boolean;
    isShow: boolean;
    isReady: boolean;
    params: Record<string, string>;
    popupCount: number;
  };
  showPopup: () => void;
  hidePopup: () => void;
  setPortal: (key: string, nodes: VNode[]) => void;
  removePortal: (key: string) => void;
};

export const PageInjectionKey =
  Symbol() as InjectionKey<PageContextValue | null>;
