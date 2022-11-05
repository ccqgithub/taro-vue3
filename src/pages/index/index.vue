<script setup lang="ts">
import { PageWrapper } from '@/components';
import MainVue from './Main.vue';

const nav = { title: '首页' };
</script>

<template>
  <PageWrapper tab :nav="nav" :auth="false">
    <MainVue />
  </PageWrapper>
</template>
