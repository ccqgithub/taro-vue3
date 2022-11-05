<script setup lang="ts">
import { computed, ref, toRefs } from 'vue';
import { NView, NImage, NText, NScrollView } from '@/components/Native';
import { Portal } from '@/components/Portal';
import { LoadingAbsolute } from '@/components/Loading';
import { getPopupLayout, getZIndex, uniqueKey } from '@/utils';
import { usePage, useTransition } from '@/use';
import imgClose from '@/assets/icon/close.svg';
import imgBack from '@/assets/icon/back-pure.svg';
import imgDown from '@/assets/icon/down.svg';
import { IPopupProps } from './types';
import S from './index.module.scss';

const props = defineProps(IPopupProps);
const emit = defineEmits<{
  (e: 'update:visible', v: boolean): void;
  (e: 'cancel'): void;
  (e: 'ok'): void;
  (e: 'show'): void;
  (e: 'hide'): void;
  (e: 'init'): void;
  (e: 'initChange', v: boolean): void;
}>();

const popupCls = uniqueKey('popup');
const showCount = ref(0);
const { visible } = toRefs(props);

const { customNav, showPopup, hidePopup } = usePage();
const layout = computed(() => {
  const { maxContentHeight, contentHeight } = getPopupLayout({
    gap: props.gap,
    customNav: customNav.value,
    safeHeight: props.safeHeight,
    height: props.height,
    headerHeight: props.customHeader ? props.customHeaderHeight : 52
  });
  return { maxContentHeight, contentHeight };
});
const zIndex = computed(() => {
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

const unit = (v: string | number) => {
  return typeof v === 'number' ? `${v}px` : v;
};

const doCancel = () => {
  if (props.cancelDisabled) return;
  if (!props.cancel) return;

  emit('cancel');

  if (!props.customCancel) {
    emit('update:visible', false);
  }
};

const doOk = () => {
  if (props.okDisabled) return;
  if (!props.ok) return;

  emit('ok');

  if (!props.customOk) {
    emit('update:visible', false);
  }
};
</script>

<template>
  <Portal
    :style="{
      zIndex
    }"
  >
    <!-- mask -->
    <NView
      v-if="props.mask && transitionVisible"
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
      v-if="transitionVisible"
      :class="{
        [S.popup]: true,
        [transitionClasses]: true,
        [popupCls]: true
      }"
      :style="{
        zIndex,
        opacity: props.hidden ? 0 : undefined,
        background: props.background
      }"
      @transitionend="onTranstionEnd"
    >
      <!-- loading -->
      <NView :style="{ height: 0 }">
        <LoadingAbsolute :show="props.loading" />
      </NView>

      <!-- header -->
      <slot v-if="props.customHeader" name="header" />
      <NView v-if="!props.customHeader" :class="S.header">
        <!-- title -->
        <NView v-if="props.title" :class="S.title">{{ props.title }}</NView>
        <!-- cancel -->
        <NView
          v-if="props.cancel"
          :class="{
            [S.cancel]: true,
            [S.isDisabled]: props.cancelDisabled
          }"
          :hover-class="S.isHover"
          @tap="doCancel"
        >
          <NView v-if="props.cancelIcon" :class="S.cancelIconWrap">
            <NImage
              :class="S.cancelIcon"
              :src="cancelImage"
              mode="aspectFill"
            ></NImage>
          </NView>
          <NText v-else>{{ props.cancelText }}</NText>
        </NView>
        <!-- ok -->
        <NView v-if="props.ok" :class="S.ok" @tap="doOk">
          {{ props.okText }}
        </NView>
      </NView>

      <!-- content -->
      <NView
        :class="S.content"
        :style="{
          maxHeight: unit(layout.maxContentHeight),
          height: unit(layout.contentHeight)
        }"
      >
        <NScrollView
          v-if="!(props.hideWhenAnimate && !inited)"
          :style="{ height: '100%' }"
          :scroll-y="props.scrollY"
          enhanced
          :bounces="false"
          :show-scrollbar="false"
        >
          <slot
            :show="props.visible"
            :inited="inited"
            :show-count="showCount"
          />
        </NScrollView>
      </NView>
    </NView>
  </Portal>
</template>
