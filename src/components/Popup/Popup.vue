<script setup lang="ts">
import { computed, useSlots, watch, onUnmounted } from 'vue';
import { NView, NImage, NText, NScrollView, Portal } from '@/components';
import { getPopupLayout, getZIndex } from '@/utils';
import { usePage } from '@/use';
import imgClose from '@/assets/icon/close.svg';
import imgBack from '@/assets/icon/back-pure.svg';
import imgDown from '@/assets/icon/down.svg';
import { IPopupProps } from './types';
import * as S from './index.module.less';

const props = defineProps(IPopupProps);
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'ok'): void;
  (e: 'cancel'): void;
}>();
const { customNav, showPopup, hidePopup } = usePage();
const slots = useSlots();
const isCustomHeader = !!slots.header;
const layout = computed(() => {
  const { maxContentHeight, contentHeight } = getPopupLayout({
    gap: props.gap,
    customNav: customNav.value,
    height: props.height,
    headerHeight: isCustomHeader ? props.customHeaderHeight : 52
  });
  return { maxContentHeight, contentHeight };
});
const zIndex = computed(() => {
  if (props.visible) return 0;
  return props.zIndex || getZIndex();
});
const cancelImage = computed(() => {
  const cancenIcon = props.cancelIcon;
  let cancelImg = '';
  if (cancenIcon === 'BACK') cancelImg = imgBack;
  if (cancenIcon === 'CLOSE') cancelImg = imgClose;
  if (cancenIcon === 'DOWN') cancelImg = imgDown;
  return cancelImg;
});

const unit = (v: string | number) => {
  return typeof v === 'number' ? `${v}px` : v;
};

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
        :class="S.popup"
        :style="{
          zIndex,
          opacity: `${props.opacity}`,
          animationDuration: props.visible ? '0.3s' : '0.1s'
        }"
      >
        <slot name="header" />
        <NView v-if="!isCustomHeader" :class="S.header">
          <!-- cancel -->
          <NView
            v-if="props.cancel"
            :class="{
              [S.cancel]: true,
              [S.isDisabled]: props.cancelDisabled
            }"
            @tap="doCancel"
          >
            <NView v-if="props.cancelIcon" :class="S.cancelIconWrap">
              <NImage
                :class="S.cancelIcon"
                :src="cancelImage"
                mode="aspectFit"
              ></NImage>
            </NView>
            <NText v-else>{{ props.cancelText }}</NText>
          </NView>
          <!-- title -->
          <NView :class="S.title">{{ props.title }}</NView>
          <NView
            :class="{
              [S.ok]: true,
              [S.isDisabled]: props.okDisabled
            }"
            @tap="doOk"
          >
            <NText>{{ props.okText }}</NText>
          </NView>
        </NView>
        <NView
          :class="S.content"
          :style="{
            maxHeight: unit(layout.maxContentHeight),
            height: unit(layout.contentHeight)
          }"
        >
          <NScrollView
            :style="{ height: '100%' }"
            :scroll-y="props.scrollY"
            enhanced
            :bounces="false"
          >
            <slot />
          </NScrollView>
        </NView>
      </NView>
    </Transition>
  </Portal>
</template>
