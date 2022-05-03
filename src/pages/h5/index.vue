<script setup lang="ts">
import Taro from '@tarojs/taro';
import { NWebView } from '@/components';

const instance = Taro.getCurrentInstance();
const params = instance.router?.params || {};
const url = decodeURIComponent(params.url || '');
</script>

<template>
  <NWebView v-if="url" :src="url"></NWebView>
</template>
