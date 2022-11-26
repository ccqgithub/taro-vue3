<script setup lang="ts">
import { useAttrs } from 'vue';
import { NView } from '@/components/Native';
import { Portal } from './Portal';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  }
});

const attrs = useAttrs();
</script>

<template>
  <NView :style="{ width: 0, height: 0, overflow: 'hidden' }">
    <template v-if="props.show">
      <Portal v-bind="attrs">
        <slot />
      </Portal>
    </template>
  </NView>
</template>
