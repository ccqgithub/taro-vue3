<script setup lang="ts">
import { computed, onUnmounted, ref, toRefs } from 'vue';
import { NView, NText } from '@/components/Native';
import { Portal } from '@/components/Portal';
import { LoadingAbsolute } from '@/components/Loading';
import { getZIndex, uniqueKey } from '@/utils';
import { usePage, useTransition } from '@/use';
import { IModalProps } from './types';
import S from './index.module.scss';

const props = defineProps(IModalProps);
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
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

const doOk = () => {
  if (props.okDisabled) return;
  if (!props.ok) return;

  emit('ok');
  emit('update:visible', false);
};

const doCancel = () => {
  if (props.cancelDisabled) return;
  if (!props.cancel) return;

  emit('cancel');
  emit('update:visible', false);
};

onUnmounted(() => {
  emit('unmount');
});
</script>

<template>
  <!-- mask -->
  <Portal :show="transitionVisible">
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
      <LoadingAbsolute :show="props.loading" />

      <NView>
        <NView v-if="props.title" :class="S.title">
          {{ props.title }}
        </NView>
        <NView v-if="props.content" :class="S.content">
          {{ props.content }}
        </NView>
        <slot :show="props.visible" :show-count="showCount" :inited="inited" />
      </NView>

      <NView :class="S.btns">
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
          <NView :class="S.line"></NView>
          <NText>{{ props.cancelText }}</NText>
        </NView>
        <!-- ok -->
        <NView
          v-if="props.ok"
          :class="{
            [S.btn]: true,
            [S.ok]: true,
            [S.isDisabled]: props.okDisabled
          }"
          @tap="doOk"
        >
          <NView :class="S.line"></NView>
          <NText>{{ props.okText }}</NText>
        </NView>
      </NView>
    </NView>
  </Portal>
</template>
