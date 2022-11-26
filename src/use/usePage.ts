import { inject, reactive, Ref, toRefs, VNode } from 'vue';
import { TaroElement } from '@tarojs/runtime';
import { PageInjectionKey } from '@/constants';

export type UsePageReturn<T extends Record<string, any>> = {
  page: Ref<string>;
  hasTab: Ref<boolean>;
  customNav: Ref<boolean>;
  params: Ref<T>;
  popupCount: Ref<number>;
  isLoaded: Ref<boolean>;
  isShow: Ref<boolean>;
  isReady: Ref<boolean>;
  showPage: Ref<string>;
  showTime: Ref<number>;
  lastShowPage: Ref<string>;
  lastShowTime: Ref<number>;
  teleportEl: Ref<TaroElement | null>;
  showPopup: () => void;
  hidePopup: () => void;
  getPortalKey: () => string;
  setPortal: (Key: string, nodes: VNode[]) => void;
  removePortal: (Key: string) => void;
};

export const usePage = <
  T extends Record<string, any> = Record<string, any>
>(): UsePageReturn<T> => {
  const page = inject(PageInjectionKey, {
    state: reactive({
      page: '',
      hasTab: false,
      customNav: false,
      params: {},
      popupCount: 0,
      isLoaded: false,
      isShow: false,
      isReady: false,
      showPage: '',
      showTime: 0,
      lastShowPage: '',
      lastShowTime: 0
    }),
    showPopup: () => {},
    hidePopup: () => {},
    getPortalKey: () => '',
    setPortal: () => {},
    removePortal: () => {}
  })!;

  return {
    ...toRefs(page.state),
    showPopup: page.showPopup,
    hidePopup: page.hidePopup,
    getPortalKey: page.getPortalKey,
    setPortal: page.setPortal,
    removePortal: page.removePortal
  } as UsePageReturn<T>;
};
