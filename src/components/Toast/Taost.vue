<script setup lang="ts">
import { ref, onMounted, onUnmounted, PropType } from 'vue';
import { NView, NImage } from '@/components/Native';
import iconDown from '@/assets/icon/done-white.svg';
import { uniqueKey } from '@/utils';
import { useTransition } from '@/use';
import type { ToastItem } from './types';
import S from './index.module.scss';

const props = defineProps({
  icon: {
    type: String as PropType<Exclude<ToastItem['icon'], undefined>>,
    default: 'none'
  },
  duration: {
    type: Number,
    default: 1500
  },
  title: {
    type: String,
    default: ''
  }
});
const emit = defineEmits<{
  (e: 'remove'): void;
}>();

const cls = uniqueKey('toast');
const images = {
  success: iconDown
};
let timer: ReturnType<typeof setTimeout> | null = null;
const visible = ref(false);

// transition
const {
  visible: transitionVisible,
  classes: transitionClasses,
  onTranstionEnd
} = useTransition({
  selector: `.${cls}`,
  visible,
  enterClass: S.enter,
  leaveClass: S.leave,
  onHide: () => {
    emit('remove');
  }
});

onMounted(() => {
  visible.value = true;
  timer = setTimeout(() => {
    visible.value = false;
    timer = setTimeout(() => {
      emit('remove');
    }, 150);
  }, props.duration + 150);
});

onUnmounted(() => {
  timer && clearTimeout(timer);
});
</script>

<template>
  <NView
    v-if="transitionVisible"
    :class="{
      [S.toast]: true,
      [cls]: true,
      [transitionClasses]: true
    }"
    @transitionend="onTranstionEnd"
  >
    <NView
      :class="{
        [S.content]: true,
        [S.hasIcon]: props.icon !== 'none'
      }"
    >
      <NImage
        v-if="(images as any)[props.icon]"
        :class="S.icon"
        :src="(images as any)[props.icon]"
        mode="aspectFit"
      ></NImage>
      <NView
        :class="{
          [S.title]: true,
          [S.hasIcon]: props.icon !== 'none'
        }"
      >
        {{ props.title }}
      </NView>
    </NView>
  </NView>
</template>
