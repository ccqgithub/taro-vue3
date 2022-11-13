<script lang="ts">
export default {
  name: 'PageLayout',
  inheritAttrs: false
};
</script>

<script setup lang="ts">
import { ref, useAttrs, computed, watchEffect } from 'vue';
import Taro from '@tarojs/taro';
import { NView } from '@/components/Native';
import { NavBar } from '@/components/NavBar';
import { TabBar } from '@/components/TabBar';
import { Settings } from '@/components/Settings';
import { LoadingAbsolute } from '@/components/Loading';
import { usePage, useLayout, useMounted } from '@/use';
import { uniqueKey } from '@/utils';
import { VPageLayoutProps } from './types';
import S from './index.module.scss';

const props = defineProps(VPageLayoutProps);
const attrs = useAttrs();
const layout = useLayout();
const isMounted = useMounted();

const mainRect = ref<{ width: number; height: number; top: number } | null>(
  null
);
const { isShow, isReady } = usePage();
const navAndTab = computed(() => {
  const nav = (props.nav || {}) as Record<string, any>;
  const navKeys = Object.keys(nav).sort();
  let str = '';
  for (const key of navKeys) {
    str += `-${key}-${nav[key].toString()}`;
  }

  return `${props.tab ? 'a' : 'b'}-${str}`;
});

const pageMainCls = uniqueKey('pageMain');

const updateSize = (callback?: () => void) => {
  if (!isShow.value) return;

  const page = Taro.getCurrentInstance().page!;
  const query = Taro.createSelectorQuery().in(page);
  query.select(`.${pageMainCls}`).boundingClientRect();
  query.exec((res) => {
    if (!res[0] || !res[0].width) {
      updateSize(callback);
      return;
    }

    mainRect.value = {
      width: res[0].width,
      height: res[0].height,
      top: res[0].top
    };
    callback?.();

    // mark page loaded to skeleton.wxml
    const page = Taro.getCurrentPages().pop();
    (page as any).setData({
      'glb.ready': true
    });
  });
};

watchEffect(() => {
  if (!isMounted.value) return;
  if (!isReady.value) return;

  const v = navAndTab.value;

  Promise.resolve().then(() => {
    updateSize();
  });

  return v;
});
</script>

<template>
  <NView
    :class="{
      [S.page]: true
    }"
    v-bind="attrs"
  >
    <NView
      :class="{
        [S.bg]: true,
        [S.isLight]:
          props.nav?.type !== 'simple' &&
          (props.nav?.colorType === undefined ||
            props.nav?.colorType === 'light'),
        [S.isDark]:
          props.nav?.type !== 'simple' && props.nav?.colorType === 'black'
      }"
      :style="{
        minHeight: `${layout.topBarHeight}px`,
        opacity: props.waitReady && !mainRect ? 0 : 1
      }"
    >
      <slot
        name="bg"
        :is-ready="!!mainRect"
        :top-bar-height="layout.topBarHeight"
      />
    </NView>

    <!-- Nav -->
    <NView
      :class="S.nav"
      :style="{
        opacity: props.waitReady && !mainRect ? 0 : 1
      }"
    >
      <slot name="nav" />
      <NavBar v-if="props.nav" v-bind="props.nav"></NavBar>
    </NView>

    <!-- content -->
    <NView
      :class="{
        [S.pageMain]: true,
        [pageMainCls]: true
      }"
    >
      <slot
        :rect="mainRect"
        :is-ready="!!mainRect"
        :top-bar-height="layout.topBarHeight"
      />
    </NView>

    <!-- tab bar  -->
    <TabBar v-if="props.tab" :class="S.tabBar" :fixed="false"></TabBar>

    <!-- settings -->
    <Settings></Settings>
  </NView>

  <!-- loading -->
  <LoadingAbsolute :show="props.loading" />
</template>
