<script setup lang="ts">
import { NView } from '@/components/Native';
import { Modal } from '@/components/Modal';

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
  <Modal
    :visible="props.visible"
    title="Pick Some"
    @update:visible="(v) => emit('update:visible', v)"
  >
    <NView :style="{ padding: '20px' }">Pick Some Thing</NView>
  </Modal>
</template>
