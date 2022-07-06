<script setup lang="ts">
import { ref, onMounted, onUnmounted, PropType } from 'vue';
import { NView, NImage, Portal } from '@/components';
import type { ToastItem } from './types';
import * as S from './index.module.scss';

const props = defineProps({
  icon: {
    type: String as PropType<Exclude<ToastItem['icon'], undefined>>,
    default: 'none'
  },
  duration: {
    type: Number,
    default: 3000
  },
  title: {
    type: String,
    default: ''
  }
});
const emit = defineEmits<{
  (e: 'remove'): void;
}>();

let timer: ReturnType<typeof setTimeout> | null = null;
const visible = ref(false);

onMounted(() => {
  visible.value = true;
  timer = setTimeout(() => {
    visible.value = false;
    timer = setTimeout(() => {
      emit('remove');
    }, 1000);
  }, props.duration + 500);
});

onUnmounted(() => {
  timer && clearTimeout(timer);
});
</script>

<template>
  <Portal>
    <Transition name="fade" type="animation">
      <NView
        v-if="visible"
        :class="S.toast"
        :style="{ animationDuration: visible ? '0.5s' : '0.3s' }"
      >
        <NView :class="S.content">
          <NImage
            v-if="props.icon !== 'none'"
            :src="props.icon"
            mode="aspectFit"
          ></NImage>
          <NView :class="S.title">{{ props.title }}</NView>
        </NView>
      </NView>
    </Transition>
  </Portal>
</template>
