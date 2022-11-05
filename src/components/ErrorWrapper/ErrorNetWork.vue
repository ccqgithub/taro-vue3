<script lang="ts">
export default {
  inheritAttrs: false
};
</script>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NView, NImage } from '@/components/Native';
import iconNetworkError from '@/assets/icon/network-error.svg';
import { VErrorWrapperProps } from './types';
import S from './index.module.scss';

const props = defineProps(VErrorWrapperProps);
const emits = defineEmits<{
  (e: 'clear-error'): void;
}>();

const refresh = () => {
  emits('clear-error');
};

const { t } = useI18n();
</script>

<template>
  <NView v-if="props.error" :class="S.box" v-bind="$attrs">
    <NView :class="S.con">
      <NImage
        :src="iconNetworkError"
        :class="S.icon"
        mode="aspectFill"
      ></NImage>
      <NView :class="S.title">{{ t('com.networkError') }}</NView>
      <NView :class="S.text">
        {{ t('com.networkErrorMsg') }}
      </NView>
      <NView :class="S.refresh" @tap="refresh">
        {{ t('com.refresh') }}
      </NView>
    </NView>
  </NView>
</template>
