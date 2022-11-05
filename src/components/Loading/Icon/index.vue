<script setup lang="ts">
import { computed, PropType } from 'vue';
import { NView, NImage } from '@/components/Native';
import imgLoading from '@/assets/icon/loading.svg';
import S from './index.module.scss';

const props = defineProps({
  size: {
    type: [Number, String] as PropType<string | number>,
    default: null
  }
});
const style = computed(() => {
  if (!props.size) return {};
  const w = typeof props.size === 'number' ? `${props.size}px` : props.size;
  return { width: w, height: w };
});
</script>

<template>
  <NView :class="S.iconBox" :style="style">
    <NImage :src="imgLoading" :class="S.icon" mode="aspectFill" />
  </NView>
</template>
