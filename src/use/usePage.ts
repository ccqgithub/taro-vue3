import { inject, reactive, Ref, toRefs, VNode } from 'vue';
import { TaroElement } from '@tarojs/runtime';
import { PageInjectionKey } from '@/constants';

export type UsePageReturn<T extends Record<string, any>> = {
  hasTab: Ref<boolean>;
  customNav: Ref<boolean>;
  isShow: Ref<boolean>;
  isReady: Ref<boolean>;
  params: Ref<T>;
  popupCount: Ref<number>;
  teleportEl: Ref<TaroElement | null>;
  showPopup: () => void;
  hidePopup: () => void;
  setPortal: (Key: string, nodes: VNode[]) => void;
  removePortal: (Key: string) => void;
};

export const usePage = <
  T extends Record<string, any> = Record<string, any>
>(): UsePageReturn<T> => {
  const page = inject(PageInjectionKey, {
    state: reactive({
      hasTab: false,
      customNav: false,
      isShow: false,
      isReady: false,
      params: {},
      popupCount: 0
    }),
    showPopup: () => {},
    hidePopup: () => {},
    setPortal: () => {},
    removePortal: () => {}
  })!;

  return {
    ...toRefs(page.state),
    showPopup: page.showPopup,
    hidePopup: page.hidePopup,
    setPortal: page.setPortal,
    removePortal: page.removePortal
  } as UsePageReturn<T>;
};
