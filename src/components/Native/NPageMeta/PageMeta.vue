<script setup lang="ts">
import { watchEffect, onUnmounted } from 'vue';
import { getCurrentInstance } from '@tarojs/taro';
import { IPageMetaProps } from './types';

const props = defineProps(IPageMetaProps);
const stopWatch = watchEffect(() => {
  const { page } = getCurrentInstance();
  const meta = props.meta;
  if (!page) return;
  page.setData?.({ pageMeta: meta });
  return meta;
});
onUnmounted(() => {
  stopWatch();
});
</script>

<template>
  <slot />
</template>
