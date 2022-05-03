<script setup lang="ts">
import { useStore } from 'pinia-di';
import { AppStore } from '@/store';
import Toast from './Taost.vue';

const appStore = useStore(AppStore);
const remove = (key: string) => {
  appStore.removeToast(key);
};
</script>

<template>
  <Toast
    v-for="{ key, ...rest } in appStore.toastList"
    :key="key"
    v-bind="rest"
    @remove="remove(key)"
  />
</template>
