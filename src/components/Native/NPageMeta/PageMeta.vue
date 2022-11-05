<script setup lang="ts">
import { watchEffect } from 'vue';
import { getCurrentInstance } from '@tarojs/taro';
import { IPageMetaProps } from './types';

const props = defineProps(IPageMetaProps);
watchEffect(() => {
  const { page } = getCurrentInstance();
  const meta = props.meta;
  if (!page) return;
  page.setData?.({ pageMeta: meta });
  return meta;
});
</script>

<template>
  <slot />
</template>
