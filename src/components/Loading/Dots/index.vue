<script setup lang="ts">
import { NView } from '@/components/Native';
import S from './index.module.scss';

const props = defineProps({
  color: {
    type: String,
    default: '#fff'
  }
});
</script>

<template>
  <NView :class="S.loading">
    <NView
      v-for="item in 4"
      :key="item"
      :class="S.div"
      :style="{ background: props.color }"
    ></NView>
  </NView>
</template>
