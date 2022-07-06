<script setup lang="ts">
import { PageWrapper, NView, NText } from '@/components';
import { useAppStore } from '@/use';
const appStore = useAppStore();
const logout = () => appStore.clearLogin();
</script>

<template>
  <PageWrapper tab auth :nav="{ title: '我的' }">
    <NView class="index">
      <NText @tap="logout">退出登录</NText>
    </NView>
  </PageWrapper>
</template>
