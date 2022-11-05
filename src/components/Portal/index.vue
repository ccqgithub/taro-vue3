<script setup lang="ts">
import { useAttrs } from 'vue';
import Taro from '@tarojs/taro';
import { NRootPortal } from '@/components/Native';
import { Portal } from './Portal';

const attrs = useAttrs();
// const platform = Taro.getSystemInfoSync().platform;
// const isDevtools = platform === 'devtools';
const isSupportPortal = Taro.canIUse('root-portal');
</script>

<template>
  <NRootPortal v-if="isSupportPortal" v-bind="attrs"><slot /></NRootPortal>
  <Portal v-if="!isSupportPortal" v-bind="attrs"><slot /></Portal>
</template>
