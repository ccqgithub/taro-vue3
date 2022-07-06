<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Taro from '@tarojs/taro';
import { PageWrapper, NView, NButton } from '@/components';
import { reportEvent, ReportKeys, showToast } from '@/utils';
import { useAppStore, usePage } from '@/use';
import { eventBus, EventKeys } from '@/store';
import { login } from '@/service';
import * as S from './index.module.scss';

const appStore = useAppStore();
const { params } = usePage<{ from?: string }>();
const loading = ref(false);
const code = ref('');
let success = false;

const doLogin = async () =>
  // evt: BaseEventOrig<ButtonProps.onGetPhoneNumberEventDetail>
  {
    // if (!evt.detail.encryptedData) {
    //   if (evt.detail.errMsg?.indexOf('deny') === -1) {
    //     showToast({ title: evt.detail.errMsg, icon: 'none' });
    //   }
    //   return;
    // }
    // const detail = evt.detail;
    console.log('dologin');
    const detail: any = {
      iv: '',
      encryptedData: ''
    };
    loading.value = true;
    try {
      const token = await login({
        code: code.value,
        iv: detail.iv,
        encryptedData: detail.encryptedData
      });
      loading.value = false;
      appStore.setToken(token);
      appStore.setLoginInfo(token);
      success = true;
      reportEvent(ReportKeys.USER_LOGIN, {
        is_new_user: 1
      });
      await appStore.getUserInfo();
      await Taro.navigateBack({
        delta: 1
      });
      eventBus.emit(EventKeys.LoginBack, {
        from: params.value.from || '',
        suecess: true
      });
    } catch (e: any) {
      loading.value = false;
      showToast({ title: e.message, icon: 'none' });
    }
  };

const doGetCode = async () => {
  loading.value = true;
  Taro.login()
    .then((res) => {
      loading.value = false;
      code.value = res.code;
    })
    .catch((e) => {
      loading.value = false;
      showToast({ title: e.errMsg, icon: 'none' });
    });
};

onMounted(() => {
  doGetCode();
});

onUnmounted(() => {
  if (!success) {
    eventBus.emit(EventKeys.LoginBack, {
      from: params.value.from || '',
      suecess: false
    });
  }
});
</script>

<template>
  <PageWrapper :nav="{ title: '登录' }">
    <NView v-if="loading">loading...</NView>
    <NView :class="S.box">
      <!-- <NButton open-type="getPhoneNumber" @get-phone-number="doLogin"
        >点我登录</NButton
      > -->
      <NButton @tap="doLogin">点我登录</NButton>
    </NView>
  </PageWrapper>
</template>
