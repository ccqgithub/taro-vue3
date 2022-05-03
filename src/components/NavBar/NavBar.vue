<script setup lang="ts">
import { computed } from 'vue';
import Taro from '@tarojs/taro';
import { NView, NImage, NText } from '@/components';
import { usePage } from '@/use';
import { getLayout } from '@/utils';
import { isTabPath } from '@/app.config';
import imgBack from '@/assets/icon/back.svg';
import imgHome from '@/assets/icon/home.svg';
import NavBarPlaceholder from './NavBarPlaceholder.vue';
import { VNavBarProps } from './types';
import * as S from './index.module.less';

const props = defineProps(VNavBarProps);
const { isShow } = usePage();
const isMain = computed(() => {
  return props.type === 'MAIN';
});
const showHome = computed(() => {
  if (props.home === false) return false;
  if (!isShow.value) return false;
  const pages = Taro.getCurrentPages();
  if (pages.length === 1 && !isTabPath(pages[0].route)) {
    return true;
  } else {
    return false;
  }
});
const showBack = computed(() => {
  if (props.back === false) return false;
  if (!isShow.value) return false;
  const pages = Taro.getCurrentPages();
  if (pages.length > 1) {
    return true;
  } else {
    return false;
  }
});
const showGroup = computed(() => {
  return showHome.value && showBack.value;
});
const { systemInfo, memuBarHeight, statusBarHeight, menuButtonInfo } =
  getLayout({
    bottomGap: true
  });
const padding = systemInfo.windowWidth - menuButtonInfo.right;

const goBack = () => {
  Taro.navigateBack({
    delta: 1
  });
};

const goHome = () => {
  Taro.switchTab({
    url: '/pages/home/index'
  });
};
</script>

<template>
  <NavBarPlaceholder v-if="props.placeholder" />
  <NView
    :class="{
      [S.navBar]: true,
      [S.isFixed]: fixed,
      [props.class]: true
    }"
  >
    <!-- status bar */ -->
    <NView :style="{ height: `${statusBarHeight}px` }"></NView>
    <!-- menu -->
    <NView
      :class="{
        [S.menu]: true,
        [S.isMain]: type === 'MAIN'
      }"
      :style="{
        height: `${memuBarHeight}px`,
        paddingLeft: `${padding}px`,
        paddingRight: `${padding}px`
      }"
    >
      <!-- 左侧按钮 -->
      <NView
        :class="S.btnWrapper"
        :style="{ width: isMain ? 'auto' : `${menuButtonInfo.width}px` }"
      >
        <NView
          v-if="showGroup"
          :class="S.btnGroup"
          :style="{ height: `${menuButtonInfo.height}px` }"
        >
          <NView :class="S.btn" @tap="goBack">
            <NImage :class="S.icon" :src="imgBack" mode="aspectFit"></NImage>
          </NView>
          <NView :class="S.btnSp"></NView>
          <NView :class="S.btn" @tap="goHome">
            <NImage :class="S.icon" :src="imgHome" mode="aspectFit"></NImage>
          </NView>
        </NView>
        <NView
          v-if="!showGroup && showBack"
          :class="S.btn"
          :style="{ height: `${menuButtonInfo.height}px` }"
          @tap="goBack"
        >
          <NImage :class="S.icon" :src="imgBack" mode="aspectFit"></NImage>
        </NView>
        <NView
          v-if="!showGroup && showHome"
          :class="S.btnCircle"
          :style="{ height: `${menuButtonInfo.height}px` }"
          @tap="goHome"
        >
          <NImage :class="S.icon" :src="imgHome" mode="aspectFit"></NImage>
        </NView>
      </NView>

      <!-- 中间 title -->
      <NView
        :class="{
          [S.title]: true
        }"
        :style="{ paddingLeft: `${isMain ? 16 - padding : 5}px` }"
      >
        <NText
          v-if="!!props.title"
          :class="{
            [S.titleText]: true,
            [S.titleMain]: type === 'MAIN'
          }"
        >
          {{ props.title }}
        </NText>
        <slot v-if="!props.title" />
      </NView>

      <!-- 胶囊位置 -->
      <NView
        :class="S.btnWrapper"
        :style="{ width: `${menuButtonInfo.width}px` }"
      ></NView>
    </NView>
  </NView>
</template>
