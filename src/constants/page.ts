import { InjectionKey, VNode } from 'vue';

export type PageContextValue = {
  state: {
    page: string;
    hasTab: boolean;
    customNav: boolean;
    params: Record<string, string>;
    popupCount: number;
    isLoaded: boolean;
    isShow: boolean;
    isReady: boolean;
    showPage: string;
    showTime: number;
    lastShowPage: string;
    lastShowTime: number;
  };
  showPopup: () => void;
  hidePopup: () => void;
  getPortalKey: () => string;
  setPortal: (key: string, nodes: VNode[]) => void;
  removePortal: (key: string) => void;
};

export const PageInjectionKey =
  Symbol() as InjectionKey<PageContextValue | null>;
