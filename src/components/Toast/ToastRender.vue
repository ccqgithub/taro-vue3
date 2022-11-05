<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'pinia-di';
import { AppStore } from '@/store';
import { usePage } from '@/use';
import Toast from './Taost.vue';

const appStore = useStore(AppStore);
const { page } = usePage();

const toastList = computed(() => {
  return appStore.toastList.filter((v) => {
    return v.page === page.value;
  });
});

const remove = (key: string) => {
  appStore.removeToast(key);
};
</script>

<template>
  <Toast
    v-for="{ key, ...rest } in toastList"
    :key="key"
    v-bind="rest"
    @remove="remove(key)"
  />
</template>
