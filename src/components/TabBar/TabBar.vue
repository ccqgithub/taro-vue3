<script setup lang="ts">
import Taro from '@tarojs/taro';
import { computed } from 'vue';
// import { useStore } from 'pinia-di';
// import { AppStore } from '@/store';
import { NView, NImage, NText } from '@/components/Native';
import { appTabs, AppRoutes, getRoutePath } from '@/app.config';
import imgHome from '@/assets/icon/home.svg';
import imgHomeActive from '@/assets/icon/home-active.svg';
import imgMe from '@/assets/icon/me.svg';
import imgMeActive from '@/assets/icon/me-active.svg';
import S from './index.module.scss';

const props = defineProps({
  current: {
    type: Number,
    default: null
  }
});

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
      icon = imgHome;
      iconActive = imgHomeActive;
      break;
    case AppRoutes.me:
      title = '我的';
      icon = imgMe;
      iconActive = imgMeActive;
      break;
  }

  return {
    key,
    title,
    icon,
    iconActive,
    path: `${getRoutePath(route as any)}`,
    badge
  };
});

const getCurrent = () => {
  const pages = Taro.getCurrentPages();
  const path = '/' + pages[0]!.route!.split('?')[0];
  let current = 0;

  tabList.forEach((item) => {
    if (item.path === path) current = item.key;
  });

  return current;
};

const cur = computed(() => {
  return props.current || getCurrent();
});

const onClick = (v: TabItem) => {
  Taro.switchTab({ url: v.path });
};

// const appStore = useStore(AppStore);
</script>

<template>
  <NView :class="[S.tabBar]">
    <NView :class="S.tabList">
      <NView
        v-for="item in tabList"
        :key="item.key"
        :class="{
          [S.itemBox]: true,
          [S.isActive]: cur === item.key
        }"
        @tap="onClick(item)"
      >
        <NView :class="S.item">
          <NImage
            :class="[S.icon]"
            :src="cur === item.key ? item.iconActive : item.icon"
            mode="aspectFill"
          ></NImage>
          <NText
            :class="{
              [S.title]: true
            }"
            >{{ item.title }}</NText
          >
        </NView>
      </NView>
    </NView>
  </NView>
</template>
