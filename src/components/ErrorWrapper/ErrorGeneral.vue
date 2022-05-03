<script setup lang="ts">
import { NView, NImage } from '@/components';
import iconWarning from '@/assets/icon/warning.svg';
import { VErrorWrapperProps } from './types';
import * as S from './index.module.less';

const props = defineProps(VErrorWrapperProps);
const emit = defineEmits<{
  (e: 'clear-error'): void;
}>();

const refresh = () => {
  emit('clear-error');
};
</script>

<template>
  <NView :class="S.box">
    <NView :class="S.con">
      <NImage :src="iconWarning" :class="S.icon" mode="aspectFit"></NImage>
      <NView :class="S.title">{{ props.error?.title || '服务器错误' }}</NView>
      <NView :class="S.text">{{
        props.error?.message || '抱歉，服务器出错。请稍后再试。'
      }}</NView>
      <NView :class="S.refresh" @tap="refresh"> 刷新 </NView>
    </NView>
  </NView>
</template>
