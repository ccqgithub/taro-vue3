<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<script setup lang="ts">
import { useAttrs } from 'vue';
import { ErrorType } from '@/utils';
import { VErrorWrapperProps } from './types';
import ErrorNetWork from './ErrorNetWork.vue';
import ErrorGeneral from './ErrorGeneral.vue';

const props = defineProps(VErrorWrapperProps);
const emit = defineEmits<{
  (e: 'clear-error'): void;
}>();
const attrs = useAttrs();

const refresh = () => {
  emit('clear-error');
};
</script>

<template>
  <slot v-if="!props.error" />
  <ErrorNetWork
    v-else-if="props.error?.type === ErrorType.NET_WORK"
    :error="props.error"
    v-bind="attrs"
    @clear-error="refresh"
  />
  <ErrorGeneral
    v-else
    :error="props.error"
    v-bind="attrs"
    @clear-error="refresh"
  />
</template>
