<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Taro from '@tarojs/taro';
import { NView, NImage, ITouchEvent, ITouch } from '@/components/Native';
import { Portal } from '@/components/Portal';
import { getConfig } from '@/config';
import { StorageKeys } from '@/constants';
import { useReady, useAppStore, useLayout } from '@/use';
import { getZIndex } from '@/utils';
import imgLogo from '@/assets/icon/logo.svg';
import S from './index.module.scss';

const { t } = useI18n();
const appStore = useAppStore();
const conf = getConfig();
const layout = useLayout();

const zIndex = ref(1);
const envs = conf.appEnvs;
const env = conf.appEnv;
const right = ref(10);
const bottom = ref(10);
const startRight = ref(10);
const startBottom = ref(10);
const start = ref<ITouch | null>(null);
const isDebug = ref(false);
const show = ref(false);

const onClick = () => {
  show.value = true;
};

const onHide = () => {
  show.value = false;
};

const computePos = (v: ITouch | null) => {
  if (!start.value) return;
  if (!v) return;
  const info = Taro.getSystemInfoSync();
  const { clientX, clientY } = v;
  const { clientX: startX, clientY: startY } = start.value;
  const diffX = clientX - startX;
  const diffY = clientY - startY;
  right.value = Math.min(
    Math.max(startRight.value - diffX, 0),
    info.windowWidth - 30
  );
  bottom.value = Math.min(
    Math.max(startBottom.value - diffY, 0),
    info.windowHeight - 130
  );
};

const touchStart = (e: ITouchEvent) => {
  start.value = e.touches[0] || null;
  startRight.value = right.value;
  startBottom.value = bottom.value;
  computePos(e.touches[0] || null);
};

const touchEnd = () => {
  start.value = null;
};

const touchMove = (e: ITouchEvent) => {
  if (!start.value) return;
  computePos(e.touches[0] || null);
};

const setEnv = (v: string) => {
  Taro.setStorageSync(StorageKeys.API_ENV, v);
  appStore.reLaunch();
};

useReady(() => {
  const info = Taro.getSystemInfoSync();
  const v = !!info.enableDebug;
  const isDevtool = info.platform === 'devtools';
  isDebug.value = v || isDevtool;
  zIndex.value = getZIndex();
});
</script>

<template>
  <template v-if="isDebug">
    <NView
      :class="S.btn"
      :style="{ right: `${right}px`, bottom: `${bottom}px` }"
      @tap="onClick"
      @touchstart="(e) => touchStart(e as any)"
      @touchmove="(e) => touchMove(e as any)"
      @touchend="touchEnd"
    >
      <NImage :class="S.btnImg" :src="imgLogo" mode="aspectFit" />
    </NView>

    <Portal :show="show" :style="{ zIndex }">
      <NView
        :class="S.box"
        :style="{ paddingTop: `${layout.topBarHeight + 20}px` }"
      >
        <NView :class="S.blockTitle">{{ t('com.env') }}:</NView>
        <NView :class="S.envs">
          <NView
            v-for="item in envs"
            :key="item"
            :class="{
              [S.env]: true,
              [S.isActive]: env === item
            }"
            @tap="setEnv(item)"
          >
            {{ item }}
          </NView>
        </NView>
        <!-- foot -->
        <NView :class="S.foot" @tap="onHide">
          {{ t('com.close') }}
        </NView>
      </NView>
    </Portal>
  </template>
</template>
