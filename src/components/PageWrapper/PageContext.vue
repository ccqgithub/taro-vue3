<script lang="ts">
export default {
  name: 'PageContext',
  inheritAttrs: false
};
</script>

<script setup lang="ts">
import { computed, ref, provide, reactive, VNode } from 'vue';
import Taro, {
  useDidShow,
  useDidHide,
  useReady,
  useLoad,
  useUnload
} from '@tarojs/taro';
import { useStore } from 'pinia-di';

import { ToastRender } from '@/components/Toast';
import { LoadingAbsolute } from '@/components/Loading';
import { NView, NPageMeta } from '@/components/Native';
import { ErrorCapture } from '@/components/ErrorCapture';
import { ErrorWrapper } from '@/components/ErrorWrapper';
import { ConfirmModal } from '@/components/ConfirmModal';
import { useLayout } from '@/use';
import { PageInjectionKey } from '@/constants';
import { AppStore, ConfirmModalRecord } from '@/store';
import { getAndClearData, CacheKeys, reportEvent } from '@/utils';

import { RenderSlots } from './RenerSot';
import { VPageWrapperProps } from './types';

const props = defineProps(VPageWrapperProps);
const appStore = useStore(AppStore);
const layout = useLayout();

// params
const hasTab = computed(() => !!props.tab);
const customNav = computed(() => props.customNav);

const params = ref<Record<string, string>>({});
const page = ref('');

const isLoaded = ref(false);
const isShow = ref(false);
const isReady = ref(false);
const showPage = ref('');
const showTime = ref(0);
const lastShowPage = ref('');
const lastShowTime = ref(0);

const pageConfirmModals = computed(() => {
  const modals = appStore.confirmModals;
  const list: Map<string, ConfirmModalRecord> = new Map();

  for (const [key, val] of modals) {
    if (val.page === page.value) {
      list.set(key, val);
    }
  }

  return list;
});

// popup
const popup = ref(0);
const showPopup = () => {
  popup.value++;
};
const hidePopup = () => {
  popup.value--;
};

// const pageStyle = computed(() => {
//   const style = `overflow: ${popup.value <= 0 ? 'auto' : 'hidden'};`;
//   return style;
// });

// @ts-ignore
// 获取参数bug https://github.com/NervJS/taro/issues/12421
useLoad((opts: any) => {
  isLoaded.value = true;

  // mark page loaded to skeleton.wxml
  const pageInstance = Taro.getCurrentPages().pop()!;
  const enterOptions = Taro.getEnterOptionsSync();

  page.value = (pageInstance.route || '').replace(/^\//, '');
  params.value = opts;

  // report events
  reportEvent('page_view', {
    path: enterOptions.path,
    scene: `${enterOptions.scene}`,
    query: JSON.stringify(enterOptions.query)
  });

  // 从小程序码打开
  if (params.value.scene) {
    reportEvent('open_from_mini_code', {
      path: page.value,
      scene: decodeURIComponent(params.value.scene),
      query: JSON.stringify(params)
    });
  }

  (pageInstance as any).setData({
    'glb.loaded': true,
    'glb.topBarHeight': layout.topBarHeight,
    'glb.appInited': appStore.dataInited
  });
});

useDidShow(() => {
  // 已经显示
  if (isShow.value) return;

  // ios bug: switch tab 会先跳之前的tab页面, 这时 router 和 page 不一致
  const curPage = Taro.getCurrentPages().pop();
  const curPath = (curPage?.route || '').replace(/^\//, '');
  if (curPath !== page.value) {
    return;
  }

  isShow.value = true;
  showPage.value = page.value;
  showTime.value = Date.now();

  const backGotoPath = getAndClearData(CacheKeys.BACK_TO_PATH);
  if (backGotoPath) {
    Taro.navigateTo({
      url: backGotoPath
    });
  }
});

useReady(() => {
  isReady.value = true;
});

useDidHide(() => {
  isShow.value = false;
  lastShowPage.value = showPage.value;
  lastShowTime.value = showTime.value;
});

useUnload(() => {
  isLoaded.value = false;
  appStore.unmountPage(page.value);
});

// portals
const portals = reactive(new Map() as Map<string, VNode[]>);
const portalsKeys: string[] = [];
for (let i = 0; i < 20; i++) {
  portalsKeys.push(`portal-${i}`);
}

const getPortalKey = () => {
  for (const key of portalsKeys) {
    if (!portals.get(key)) return key;
  }
  console.warn(
    `最多同时渲染 ${portalsKeys.length} 个 Portal，为了避免问题，请使用 Portal 的 'show' 属性控制渲染 Portal！如：<Portal :show="popupShow"></Portal>`
  );
  return '';
};
const setPortal = (key: string, nodes: VNode[]) => {
  portals.set(key, nodes);
};
const removePortal = (key: string) => {
  portals.delete(key);
};

const clearError = () => {
  if (appStore.errors.length) {
    appStore.refreshAll();
  }
};

// provide
const state = reactive({
  page,
  hasTab,
  customNav,
  params,
  popupCount: popup,
  isLoaded,
  isShow,
  isReady,
  showPage,
  showTime,
  lastShowPage,
  lastShowTime
});

provide(PageInjectionKey, {
  state,
  showPopup,
  hidePopup,
  getPortalKey,
  setPortal,
  removePortal
});
</script>

<template>
  <!-- 等待 Taro 支持pageMeta：https://github.com/NervJS/taro/pull/10923 -->
  <NPageMeta v-if="isReady" :meta="{}" />

  <ErrorCapture>
    <ErrorWrapper
      :error="appStore.errors.length ? appStore.errors[0] : null"
      @clear-error="clearError"
    >
      <template v-if="appStore.isInited">
        <slot />

        <!-- teleport render -->
        <!-- 外面加一层View，否则渲染的时候会影响页面内ScrollView的布局，从而引发bug（一个Bug：弹窗出现是会滚动到顶部） -->
        <NView v-if="isReady" :style="{ height: '0px', width: '0px' }">
          <!-- confirm modals -->
          <NView :style="{ height: '0px', width: '0px' }">
            <ConfirmModal
              v-for="[
                key,
                {
                  ok,
                  hide,
                  cancel,
                  unmount,
                  visibleRef,
                  props: p,
                  onVisibleChange
                }
              ] in pageConfirmModals"
              :key="key"
              :visible="visibleRef.value"
              v-bind="p"
              @update:visible="
                (v) => {
                  visibleRef.value = v;
                  onVisibleChange?.(v);
                }
              "
              @ok="ok"
              @hide="hide"
              @cancel="(v) => cancel(v)"
              @unmount="unmount()"
            />
          </NView>

          <!-- 全局自定义toast组件 -->
          <NView :style="{ height: '0px', width: '0px' }">
            <ToastRender />
          </NView>

          <!-- portals -->
          <NView :style="{ height: '0px', width: '0px' }">
            <NView
              v-for="key in portalsKeys"
              :key="key"
              :style="{ height: '0px', width: '0px' }"
            >
              <NView v-if="portals.get(key)">
                <RenderSlots :nodes="portals.get(key)"></RenderSlots>
              </NView>
            </NView>
          </NView>
        </NView>
      </template>
    </ErrorWrapper>

    <!-- loading -->
    <LoadingAbsolute :show="!appStore.isInited" />
  </ErrorCapture>
</template>
