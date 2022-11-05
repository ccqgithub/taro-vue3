<script setup lang="ts">
import { NView } from '@/components/Native';
import { Popup } from '@/components/Popup';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
}>();
</script>

<template>
  <Popup
    :visible="props.visible"
    :height="500"
    title="Pick Some"
    @update:visible="(v) => emit('update:visible', v)"
  >
    <NView :style="{ padding: '20px' }">Pick Some Thing</NView>
  </Popup>
</template>
