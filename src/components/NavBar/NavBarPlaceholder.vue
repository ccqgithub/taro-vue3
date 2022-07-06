<script setup lang="ts">
import { NView } from '@/components';
import { getLayout } from '@/utils';

const { topBarHeight } = getLayout({
  bottomGap: true
});
</script>

<template>
  <NView :style="{ height: `${topBarHeight}px`, flex: '0 0 auto' }"></NView>;
</template>
