<script setup lang="ts">
import Taro from '@tarojs/taro';
import { NView, NButton } from '@/components';
import * as S from './index.module.less';

const gotoLogin = () => {
  Taro.navigateTo({
    url: '/pages/login/index'
  });
};
</script>

<template>
  <NView :class="S.box">
    <NView :class="S.title"> 登录 </NView>
    <NView :class="S.desc"> 请先登录！ </NView>
    <NView :class="S.btns">
      <NButton :class="S.btn" @tap="gotoLogin"> 登录 </NButton>
    </NView>
  </NView>
</template>
