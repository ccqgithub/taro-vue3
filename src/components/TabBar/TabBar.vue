<script setup lang="ts">
import Taro from '@tarojs/taro';
import { computed } from 'vue';
// import { useStore } from 'pinia-di';
// import { AppStore } from '@/store';
import { NView, NImage, NText } from '@/components';
import { appTabs, AppRoutes, getRoutePath } from '@/app.config';
import homeIcon from '@/assets/icon/home.svg';
import homeIconActive from '@/assets/icon/home-active.svg';
import meIcon from '@/assets/icon/me.svg';
import meIconActive from '@/assets/icon/me-active.svg';
import * as S from './index.module.scss';

interface TabItem {
  title: string;
  key: number;
  icon: string;
  iconActive: string;
  path: string;
  badge?: boolean;
}
const tabList: TabItem[] = appTabs.map((route, key) => {
  let title = '';
  let icon = '';
  let iconActive = '';
  let badge = false;
  switch (route) {
    default:
      break;
    case AppRoutes.index:
      title = '首页';
      icon = homeIcon;
      iconActive = homeIconActive;
      break;
    case AppRoutes.me:
      title = '我的';
      icon = meIcon;
      iconActive = meIconActive;
      break;
  }
  return {
    key,
    title,
    icon,
    iconActive,
    path: `${getRoutePath(route)}`,
    badge
  };
});
const getCurrent = () => {
  const pages = Taro.getCurrentPages();
  const path = '/' + pages[0].route.split('?')[0];
  let current = 0;
  tabList.forEach((item) => {
    if (item.path === path) current = item.key;
  });

  return current;
};

const props = defineProps({
  current: {
    type: Number,
    default: null
  }
});
const cur = computed(() => {
  return props.current || getCurrent();
});
const onClick = (v: TabItem) => {
  Taro.switchTab({ url: v.path });
};
// const appStore = useStore(AppStore);
</script>

<template xlang="wxml">
  <NView :class="[S.tabBar]">
    <NView
      v-for="item in tabList"
      :key="item.key"
      :class="[
        {
          [S.item]: true,
          [S.active]: cur === item.key
        }
      ]"
      @tap="onClick(item)"
    >
      <NView :class="[S.iconBox]">
        <NImage
          :class="[S.icon]"
          :src="cur === item.key ? item.iconActive : item.icon"
          mode="aspectFit"
        ></NImage>
      </NView>
      <NText :class="[S.title]">{{ item.title }}</NText>
    </NView>
  </NView>
</template>
