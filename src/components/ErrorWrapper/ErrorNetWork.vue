<script setup lang="ts">
import { NView, NImage } from '@/components';
import iconNetworkError from '@/assets/icon/network-error.svg';
import { VErrorWrapperProps } from './types';
import * as S from './index.module.less';

const props = defineProps(VErrorWrapperProps);
const emits = defineEmits<{
  (e: 'clear-error'): void;
}>();

const refresh = () => {
  emits('clear-error');
};
</script>

<template>
  <NView v-if="props.error" :class="S.box">
    <NView :class="S.con">
      <NImage :src="iconNetworkError" :class="S.icon" mode="aspectFit"></NImage>
      <NView :class="S.title"> 网络不可用 </NView>
      <NView :class="S.text"> 请检查您的网络设置后重试。 </NView>
      <NView :class="S.refresh" @tap="refresh"> 刷新 </NView>
    </NView>
  </NView>
</template>
