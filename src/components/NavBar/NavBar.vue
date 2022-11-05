<script setup lang="ts">
import { computed } from 'vue';
import Taro from '@tarojs/taro';
import { NView, NImage, NText } from '@/components/Native';
import { usePage, useLayout } from '@/use';
import { isTabPath, getRoutePath } from '@/app.config';
import imgBack from '@/assets/icon/back.svg';
import imgHome from '@/assets/icon/home.svg';
import imgBackWhite from '@/assets/icon/back-white.svg';
import imgHomeWhite from '@/assets/icon/home-white.svg';
import { VNavBarProps } from './types';
import S from './index.module.scss';

const props = defineProps(VNavBarProps);

const { isShow } = usePage();
const iconBack = computed(() => {
  if (props.colorType === 'light') return imgBackWhite;
  return imgBack;
});
const iconHome = computed(() => {
  if (props.colorType === 'light') return imgHomeWhite;
  return imgHome;
});
const isMain = computed(() => {
  return props.pageType === 'main';
});

const showHome = computed(() => {
  if (props.home === false) return false;
  if (!isShow.value) return false;
  const pages = Taro.getCurrentPages();
  if (pages.length === 1 && !isTabPath(pages[0]!.route!)) {
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

const layout = useLayout();
const padding = layout.systemInfo.windowWidth - layout.menuButtonInfo.right;

const goBack = () => {
  Taro.navigateBack({
    delta: 1
  });
};

const goHome = () => {
  Taro.switchTab({
    url: getRoutePath('space')
  });
};
</script>

<template>
  <NView
    :class="{
      [S.nav]: true,
      [S.isFixed]: props.type === 'fixed',
      [S.isSimple]: props.type === 'simple',
      [S.isLight]: props.colorType === 'light'
    }"
    :style="{
      height: `${layout.topBarHeight}px`
    }"
  >
    <!-- status bar */ -->
    <NView
      v-if="props.type !== 'simple'"
      :style="{ height: `${layout.statusBarHeight}px` }"
    ></NView>
    <!-- menu -->
    <NView
      :class="{
        [S.menu]: true,
        [S.isSimple]: props.type === 'simple'
      }"
      :style="{
        height: `${layout.memuBarHeight}px`,
        paddingLeft: `${10}px`,
        paddingRight: `${padding}px`,
        top:
          props.type === 'simple'
            ? `${layout.topBarHeight - layout.memuBarHeight}px`
            : 'auto'
      }"
    >
      <!-- 左侧按钮 -->
      <NView
        :class="S.btnWrapper"
        :style="{
          width: isMain ? 'auto' : `${layout.menuButtonInfo.width}px`
        }"
      >
        <!-- group -->
        <NView
          v-if="showGroup"
          :class="S.btnGroup"
          :style="{
            height: `${layout.menuButtonInfo.height}px`
          }"
        >
          <NView :class="S.btn" :hover-class="S.isHover" @tap="goBack">
            <NImage :class="S.icon" :src="iconBack" mode="aspectFill"></NImage>
          </NView>
          <NView :class="S.btnSp"></NView>
          <NView :class="S.btn" :hover-class="S.isHover" @tap="goHome">
            <NImage :class="S.icon" :src="iconHome" mode="aspectFill"></NImage>
          </NView>
        </NView>
        <!-- back -->
        <NView
          v-if="!showGroup && showBack"
          :class="S.btn"
          :hover-class="S.isHover"
          :style="{ height: `${layout.menuButtonInfo.height}px` }"
          @tap="goBack"
        >
          <NImage :class="S.icon" :src="iconBack" mode="aspectFill"></NImage>
        </NView>
        <!-- home -->
        <NView
          v-if="!showGroup && showHome"
          :class="S.btn"
          :hover-class="S.isHover"
          :style="{ height: `${layout.menuButtonInfo.height}px` }"
          @tap="goHome"
        >
          <NImage :class="S.icon" :src="iconHome" mode="aspectFill"></NImage>
        </NView>
      </NView>

      <!-- 中间 title -->
      <NView
        v-if="props.type !== 'simple'"
        :class="{
          [S.title]: true,
          [S.isLight]: props.colorType === 'light',
          [S.isMain]: props.pageType === 'main'
        }"
        :style="{ paddingLeft: `${isMain ? 16 - padding : 5}px` }"
      >
        <NText
          v-if="!!props.title"
          :class="{
            [S.titleText]: true,
            [S.titleMain]: props.pageType === 'main'
          }"
        >
          {{ props.title }}
        </NText>
        <slot v-if="!props.title" />
      </NView>

      <!-- 胶囊位置 -->
      <NView
        v-if="props.type !== 'simple'"
        :class="S.btnWrapper"
        :style="{ width: `${layout.menuButtonInfo.width}px` }"
      ></NView>
    </NView>
  </NView>
</template>
