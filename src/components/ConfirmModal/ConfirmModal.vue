<script setup lang="ts">
import { computed, watch, onUnmounted, useSlots } from 'vue';
import { NView, NText, Portal } from '@/components';
import { getZIndex } from '@/utils';
import { usePage } from '@/use';
import { IConfirmModalProps } from './types';
import * as S from './index.module.less';

const props = defineProps(IConfirmModalProps);
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
  (e: 'unmount'): void;
}>();
const slots = useSlots();
const isSlotTitle = !!slots.title;
const isSlotContent = !!slots.default;

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
  emit('unmount');
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
        <NView :class="S.title">
          <NText v-if="!isSlotTitle && props.title">{{ props.title }}</NText>
          <slot name="title" />
        </NView>

        <NView :class="S.content">
          <NText v-if="!isSlotContent && props.content">{{
            props.content
          }}</NText>
          <slot />
        </NView>

        <NView :class="S.btns">
          <!-- ok -->
          <NView
            :class="{
              [S.btn]: true,
              [S.ok]: true,
              [S.isDisabled]: props.okDisabled
            }"
            @tap="doOk"
          >
            <NText>{{ props.okText }}</NText>
          </NView>
          <!-- cancel -->
          <NView
            v-if="props.cancel"
            :class="{
              [S.btn]: true,
              [S.cancel]: true,
              [S.isDisabled]: props.cancelDisabled
            }"
            @tap="doCancel"
          >
            <NText>{{ props.cancelText }}</NText>
          </NView>
        </NView>
      </NView>
    </Transition>
  </Portal>
</template>
