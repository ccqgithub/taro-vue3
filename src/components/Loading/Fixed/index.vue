<script setup lang="ts">
import { NView, NImage } from '@/components/Native';
import { Portal } from '@/components/Portal';
import imgLoading from '@/assets/icon/loading.svg';
import S from './index.module.scss';

const props = defineProps({
  show: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <Portal :show="props.show">
    <NView :class="S.loading">
      <NView :class="S.iconBox">
        <NImage :src="imgLoading" :class="S.icon" mode="aspectFill" />
      </NView>
    </NView>
  </Portal>
</template>
