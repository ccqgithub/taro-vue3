<script setup lang="ts">
import { useAttrs } from 'vue';
import { NView } from '@/components/Native';
import S from './index.module.scss';

const attrs = useAttrs();
</script>

<template>
  <NView :class="S.loading" v-bind="attrs">
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
    <NView :class="S.div"></NView>
  </NView>
</template>
