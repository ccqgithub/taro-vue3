<script setup lang="ts">
import { computed, ref } from 'vue';
import { useStore } from 'pinia-di';
import { useI18n } from 'vue-i18n';
import {
  PageWrapper,
  NView,
  NText,
  PickSomeThing,
  ShowSomeThing
} from '@/components';
import { showToast, confirm } from '@/utils';
import { AppStore } from '@/store';
import {} from '@/app.config';
import * as S from './index.module.scss';

const appStore = useStore(AppStore);
const { t } = useI18n();
const msg = computed(() => t('heillo_world'));
const showTip = () => {
  appStore.showToast(msg.value);
};
const toLogin = async () => {
  const a = await appStore.loginPromise();
  if (a) {
    showToast('登录成功');
  }
};

const pickVisible = ref(false);
const showPopup = () => {
  pickVisible.value = true;
};

const modalVisible = ref(false);
const showModal = () => {
  modalVisible.value = true;
};

const showConfirm = async () => {
  const v = await confirm({
    title: 'Test Title',
    content: 'Test Content'
  });
  console.log(v);
};
</script>

<template>
  <PageWrapper tab :nav="{ title: '首页' }" :auth="false">
    <NView :class="S.block">
      <NView :class="S.blockTit"> 翻译 </NView>
      <NView>
        <NText>{{ msg }}</NText>
      </NView>
    </NView>
    <NView :class="S.block">
      <NView :class="S.blockTit"> Toast </NView>
      <NView>
        <NView @tap="showTip">Show Toast</NView>
      </NView>
    </NView>
    <NView :class="S.block">
      <NView :class="S.blockTit">Popup</NView>
      <NView>
        <NView @tap="showPopup">Show Popup</NView>
        <PickSomeThing v-model:visible="pickVisible" />
      </NView>
    </NView>
    <NView :class="S.block">
      <NView :class="S.blockTit">Modal</NView>
      <NView>
        <NView @tap="showModal">Show Modal</NView>
        <ShowSomeThing v-model:visible="modalVisible" />
      </NView>
    </NView>
    <NView :class="S.block">
      <NView :class="S.blockTit">Confirm Modal</NView>
      <NView>
        <NView @tap="showConfirm">Show Confirm Modal</NView>
      </NView>
    </NView>
    <NView :class="S.block">
      <NView :class="S.blockTit"> 导航 </NView>
      <NView>
        <NView v-if="!appStore.isLogin" @tap="toLogin">登录</NView>
        <NView v-if="appStore.userInfo">
          登录用户{{ appStore.userInfo?.nickname }}
        </NView>
      </NView>
    </NView>
  </PageWrapper>
</template>
