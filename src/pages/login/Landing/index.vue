<script setup lang="ts">
import Taro from '@tarojs/taro';
import { NView, NImage, NButton } from '@/components/Native';
import PageLayout from '@/components/PageWrapper/PageLayout.vue';
import { getRoutePath } from '@/app.config';
import imgLogo from '@/assets/icon/logo.svg';
import S from './index.module.scss';

const props = defineProps({
  tab: {
    type: Boolean,
    default: false
  }
});

const toLogin = () => {
  Taro.navigateTo({
    url: getRoutePath('login')
  });
};
</script>

<template>
  <PageLayout :tab="props.tab" :nav="{ title: '登录', colorType: 'light' }">
    <NView :class="S.page">
      <NImage :class="S.logo" :src="imgLogo" mode="aspectFit" />
      <NView :class="S.title"
        >巴啦巴拉巴啦巴拉巴啦巴拉巴啦巴拉巴啦巴拉巴啦巴拉</NView
      >
      <NView :class="S.text">
        {{ '巴啦巴拉巴啦巴拉巴啦巴拉巴啦巴拉巴啦巴拉巴啦巴拉巴啦巴拉' }}
      </NView>
      <NButton :class="S.btn" type="black" size="large" @tap="toLogin">
        注册/登录
      </NButton>
    </NView>
  </PageLayout>
</template>
