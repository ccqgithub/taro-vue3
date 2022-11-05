<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { NView, NImage } from '@/components/Native';
import iconWarning from '@/assets/icon/warning.svg';
import { VErrorWrapperProps } from './types';
import S from './index.module.scss';

const props = defineProps(VErrorWrapperProps);
const emit = defineEmits<{
  (e: 'clear-error'): void;
}>();

const refresh = () => {
  emit('clear-error');
};

const { t } = useI18n();
</script>

<template>
  <NView :class="S.box">
    <NView :class="S.con">
      <NImage :src="iconWarning" :class="S.icon" mode="aspectFill"></NImage>
      <NView :class="S.title">
        {{ props.error?.title || t('com.serverError') }}
      </NView>
      <NView :class="S.text">
        {{ props.error?.message || t('com.serverErrorMsg') }}
        <!-- {{ props.error?.stack }} -->
      </NView>
      <NView :class="S.refresh" @tap="refresh">{{ t('com.refresh') }}</NView>
    </NView>
  </NView>
</template>
