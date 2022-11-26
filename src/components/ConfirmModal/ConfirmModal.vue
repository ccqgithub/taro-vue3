<script setup lang="ts">
import { computed, onUnmounted, ref, toRefs } from 'vue';
import { NView, NButton, NText } from '@/components/Native';
import { Portal } from '@/components/Portal';
import { getZIndex, uniqueKey, normalizeError } from '@/utils';
import { usePage, useTransition } from '@/use';
import { IConfirmModalProps } from './types';
import S from './index.module.scss';

const props = defineProps(IConfirmModalProps);
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'ok'): void;
  (e: 'cancel', v?: false): void;
  (e: 'unmount'): void;
  (e: 'show'): void;
  (e: 'hide'): void;
  (e: 'init'): void;
  (e: 'initChange', v: boolean): void;
}>();

const { showPopup, hidePopup } = usePage();

const popupCls = uniqueKey('popup');
const showCount = ref(0);
const { visible } = toRefs(props);

const zIndex = computed(() => {
  return props.zIndex || getZIndex();
});

// transition
const {
  visible: transitionVisible,
  classes: transitionClasses,
  inited,
  onTranstionEnd
} = useTransition({
  selector: `.${popupCls}`,
  visible,
  enterClass: S.enter,
  leaveClass: S.leave,
  onShow: () => {
    emit('show');
    showPopup();
  },
  onHide: () => {
    emit('hide');
    hidePopup();
  },
  onInit: () => {
    emit('init');
  },
  onInitedChange: (v) => {
    emit('initChange', v);
  }
});

const doOk = async () => {
  if (props.openType) return;

  if (props.okDisabled) return;
  if (!props.ok) return;

  try {
    const canClose = await props.okClick();
    if (!canClose) return;
  } catch (e) {
    normalizeError(e, {}, 'ConfirmModal.doOk');
  }

  emit('ok');

  if (!props.customOk) {
    emit('update:visible', false);
  }
};

const onOpenType = (e: any) => {
  props.openTypeClick(e);
  emit('ok');
  emit('update:visible', false);
};

const doCancel = (cancelClick = false) => {
  if (props.cancelDisabled) return;
  if (!props.cancel) return;

  emit('cancel', cancelClick ? false : undefined);

  if (!props.customCancel) {
    emit('update:visible', false);
  }
};

onUnmounted(() => {
  emit('unmount');
});
</script>

<template>
  <!-- mask -->
  <Portal
    :style="{
      zIndex
    }"
    :show="transitionVisible"
  >
    <NView
      v-if="props.mask"
      :class="{
        [S.mask]: true,
        [transitionClasses]: true
      }"
      :style="{
        zIndex,
        opacity: props.hidden ? 0 : undefined
      }"
      @tap="maskClose && doCancel()"
      @transitionend="onTranstionEnd"
    ></NView>

    <!-- popup -->
    <NView
      :class="{
        [S.modal]: true,
        [transitionClasses]: true,
        [popupCls]: true
      }"
      :style="{
        zIndex,
        opacity: props.hidden ? 0 : undefined
      }"
      @transitionend="onTranstionEnd"
    >
      <NView
        :class="{
          [S.title]: true,
          [S.noContent]: !$slots.content && !props.content
        }"
      >
        <NText v-if="!$slots.title && props.title">{{ props.title }}</NText>
        <slot name="title" />
      </NView>

      <NView v-if="!$slots.content && props.content" :class="S.content">
        <NText>{{ props.content }}</NText>
        <slot :show="props.visible" :show-count="showCount" :inited="inited" />
      </NView>

      <NView :class="S.btns">
        <!-- cancel -->
        <NButton
          v-if="props.cancel"
          :class="{
            [S.btn]: true,
            [S.cancel]: true,
            [S.isDisabled]: props.cancelDisabled
          }"
          @tap="doCancel(true)"
        >
          <NText>{{ props.cancelText }}</NText>
        </NButton>
        <!-- ok -->
        <NButton
          :class="{
            [S.btn]: true,
            [S.ok]: true,
            [S.isDisabled]: props.okDisabled
          }"
          :open-type="props.openType"
          @chooseavatar="(e) => onOpenType(e)"
          @tap="doOk"
        >
          <NText>{{ props.okText }}</NText>
        </NButton>
      </NView>
    </NView>
  </Portal>
</template>
