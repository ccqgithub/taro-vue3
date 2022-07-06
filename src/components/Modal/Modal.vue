<script setup lang="ts">
import { computed, watch, onUnmounted } from 'vue';
import { NView, NText, Portal } from '@/components';
import { getZIndex } from '@/utils';
import { usePage } from '@/use';
import { IModalProps } from './types';
import * as S from './index.module.scss';

const props = defineProps(IModalProps);
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
}>();
const { showPopup, hidePopup } = usePage();
const zIndex = computed(() => {
  if (props.visible) return 0;
  return props.zIndex || getZIndex();
});

const doOk = () => {
  if (props.okDisabled) return;
  if (!props.ok) return;
  emit('ok');
  if (!props.customOk) {
    emit('update:visible', false);
  }
};

const doCancel = () => {
  if (props.cancelDisabled) return;
  if (!props.cancel) return;
  emit('cancel');
  if (!props.customCancel) {
    emit('update:visible', false);
  }
};

const stopWatch = watch(
  () => props.visible,
  () => {
    // hide
    if (!props.visible) {
      hidePopup();
    }
    // show
    if (props.visible) {
      showPopup();
    }
  }
);

onUnmounted(() => {
  stopWatch();
});
</script>

<template>
  <!-- mask -->
  <Portal>
    <Transition name="fade" type="animation">
      <NView
        v-if="props.visible && props.mask"
        :class="S.mask"
        :style="{
          zIndex,
          opacity: `${props.opacity}`,
          animationDuration: props.visible ? '0.3s' : '0.1s'
        }"
        @tap="maskClose && doCancel()"
      ></NView>
    </Transition>

    <!-- popup -->
    <Transition name="move" type="animation">
      <NView
        v-if="props.visible"
        :class="S.modal"
        :style="{
          zIndex,
          opacity: `${props.opacity}`,
          animationDuration: props.visible ? '0.3s' : '0.1s'
        }"
      >
        <NView><slot /></NView>
        <NView>
          <!-- ok -->
          <NView
            :class="{
              [S.ok]: true,
              [S.isDisabled]: props.okDisabled
            }"
            @tap="doOk"
          >
            <NView :class="S.line"></NView>
            <NText>{{ props.okText }}</NText>
          </NView>
          <!-- cancel -->
          <NView
            v-if="props.cancel"
            :class="{
              [S.cancel]: true,
              [S.isDisabled]: props.cancelDisabled
            }"
            @tap="doCancel"
          >
            <NView :class="S.line"></NView>
            <NText>{{ props.cancelText }}</NText>
          </NView>
        </NView>
      </NView>
    </Transition>
  </Portal>
</template>
