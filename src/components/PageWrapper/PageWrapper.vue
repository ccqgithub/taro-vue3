<script setup lang="ts">
import { computed, ref, onMounted, provide, reactive, VNode } from 'vue';
import { useI18n } from 'vue-i18n';
import Taro, { useDidShow, useDidHide, useReady } from '@tarojs/taro';
import { useStore } from 'pinia-di';
import { AppStore } from '@/store';
import {
  NView,
  NScrollView,
  NPageMeta,
  ErrorCapture,
  ErrorWrapper,
  NavBar,
  LoginLanding,
  TabBar,
  ToastRender,
  BaseEventOrig,
  ScrollViewProps,
  ConfirmModal
} from '@/components';
import { getAndClearData, CacheKeys, reportEvent, ReportKeys } from '@/utils';
import { PageInjectionKey } from '@/constants';
import { RenderSlots } from './RenerSot';
import { VPageWrapperProps } from './types';
import * as S from './index.module.scss';

const props = defineProps(VPageWrapperProps);
const emit = defineEmits<{
  (e: 'scroll', v: BaseEventOrig<ScrollViewProps.onScrollDetail>): void;
}>();
const appStore = useStore(AppStore);
const { t } = useI18n();

// params
const hasTab = computed(() => !!props.tab);
const customNav = computed(() => props.customNav);
const canPullDown = false;
const needLogin = computed(() => {
  return props.auth && appStore.dataInited && !appStore.isLogin;
});
const instance = Taro.getCurrentInstance();
const params = (instance.router?.params || {}) as Record<string, string>;

// show, ready
const isShow = ref(false);
const isReady = ref(false);
useDidHide(() => (isShow.value = false));
useReady(() => (isReady.value = true));

// portals
const portals = reactive(new Map() as Map<string, VNode[]>);
const setPortal = (key: string, nodes: VNode[]) => {
  portals.set(key, nodes);
};
const removePortal = (key: string) => {
  portals.delete(key);
};

// popup
const popup = ref(0);
const showPopup = () => {
  popup.value++;
};
const hidePopup = () => {
  popup.value--;
};

const clearError = () => {
  if (appStore.errors.length) {
    appStore.refreshAll();
  }
};

useDidShow(() => {
  // back and goto page
  const router = Taro.getCurrentInstance().router;
  const routerPath = (router?.path || '').replace(/^\//, '');
  const page = Taro.getCurrentPages().pop();
  const pagePath = (page?.route || '').replace(/^\//, '');
  // ios bug: switch tab 会先跳之前的tab页面, 这时 router 和 page 不一致
  if (routerPath !== pagePath) {
    return;
  }
  isShow.value = true;
  const backGotoPath = getAndClearData(CacheKeys.BACK_TO_PATH);
  if (backGotoPath) {
    Taro.navigateTo({
      url: backGotoPath
    });
  }
});

onMounted(() => {
  // report events
  reportEvent(ReportKeys.PAGE_VIEW);
  if (!params.scene) return;
  reportEvent(ReportKeys.OPEN_FROM_MINI_CODE, {
    mini_code_scene: decodeURIComponent(params.scene)
  });
});

const state = reactive({
  hasTab,
  customNav,
  isShow,
  isReady,
  params,
  popupCount: popup
});
provide(PageInjectionKey, {
  state,
  showPopup,
  hidePopup,
  setPortal,
  removePortal
});
</script>

<template>
  <!-- 等待 Taro 支持pageMeta：https://github.com/NervJS/taro/pull/10923 -->
  <NPageMeta
    :meta="{
      pageStyle: `overflow: ${popup <= 0 ? 'visible' : 'hidden'}`
    }"
  />
  <ErrorCapture>
    <ErrorWrapper
      :error="appStore.errors.length ? appStore.errors[0] : null"
      @clear-error="clearError"
    >
      <NView
        :class="{
          [S.page]: true,
          [S.hasTab]: hasTab
        }"
      >
        <!-- Nav -->
        <NavBar v-if="needLogin" :title="t('app_title')"></NavBar>
        <template v-if="!needLogin">
          <slot name="nav" />
          <NavBar v-if="props.nav" v-bind="props.nav" :fixed="false"></NavBar>
        </template>

        <!-- content -->
        <NView :class="S.pageMain">
          <NScrollView
            :class="S.pageScroll"
            scroll-y
            :enhanced="canPullDown"
            :bounces="canPullDown"
            @scroll="
              (e) => {
                emit('scroll', e);
              }
            "
          >
            <LoginLanding v-if="needLogin" />
            <slot v-else />
          </NScrollView>
        </NView>

        <!-- tab bar  -->
        <TabBar v-if="props.tab" :class="S.tabBar" :fixed="false"></TabBar>
      </NView>
      <!-- 全局自定义toast组件 -->
      <ToastRender />
    </ErrorWrapper>
  </ErrorCapture>

  <!-- confirm modals -->
  <ConfirmModal
    v-for="[
      key,
      { ok, cancel, unmount, visibleRef, props: p }
    ] in appStore.confirmModals"
    :key="key"
    :visible="visibleRef.value"
    v-bind="p"
    @update:visible="(v) => (visibleRef.value = v)"
    @ok="ok()"
    @cancel="cancel()"
    @unmount="unmount()"
  />

  <!-- teleport render -->
  <!-- 外面加一层View，否则渲染的时候会影响页面内ScrollView的布局，从而引发bug（一个Bug：弹窗出现是会滚动到顶部） -->
  <NView :style="{ height: '0px', width: '0px' }">
    <NView>
      <template v-for="[key, item] in portals" :key="key">
        <RenderSlots :nodes="item"></RenderSlots>
      </template>
    </NView>
  </NView>
</template>
