<script lang="ts">
export default {
  name: 'PageWrapper',
  inheritAttrs: false
};
</script>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/use';
import LoginLayout from '@/pages/login/Landing/index.vue';
import PageContext from './PageContext.vue';
import PageLayout from './PageLayout.vue';
import { VPageLayoutProps, VPageWrapperProps } from './types';

const props = defineProps({
  ...VPageLayoutProps,
  ...VPageWrapperProps
});

const appStore = useAppStore();
const authorized = computed(() => {
  if (!appStore.dataInited) return false;
  if (props.auth) return appStore.isLogin;
  return true;
});
</script>

<template>
  <PageContext
    :custom-nav="props.customNav"
    :tab="props.tab"
    :auth="props.auth"
    :nav="props.nav"
  >
    <PageLayout
      v-if="authorized"
      :tab="props.tab"
      :nav="props.nav"
      :loading="props.loading"
      :wait-ready="props.waitReady"
    >
      <template #bg="p">
        <slot name="bg" v-bind="p" />
      </template>
      <template #nav="p">
        <slot name="nav" v-bind="p" />
      </template>
      <template #default="p">
        <slot v-bind="p" />
      </template>
    </PageLayout>

    <LoginLayout v-if="!authorized" :tab="props.tab"></LoginLayout>
  </PageContext>
</template>
