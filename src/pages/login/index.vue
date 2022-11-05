<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import Taro from '@tarojs/taro';
import { BaseEventOrig, ButtonProps } from '@tarojs/components';
import { PageWrapper, NView, NButton } from '@/components';
import { reportEvent, ReportKeys, showToast } from '@/utils';
import { useAppStore, usePage } from '@/use';
import { eventBus, EventKeys } from '@/store';
import { loginByPhone } from '@/service';
import S from './index.module.scss';

const appStore = useAppStore();
const { params } = usePage<{ from?: string }>();
const loading = ref(false);
const code = ref('');
let success = false;

const doLogin = async (
  evt: BaseEventOrig<ButtonProps.onGetPhoneNumberEventDetail>
) => {
  if (!evt.detail.encryptedData) {
    if (evt.detail.errMsg?.indexOf('deny') === -1) {
      showToast({ title: evt.detail.errMsg, icon: 'none' });
    }
    return;
  }
  const detail = evt.detail;
  loading.value = true;
  try {
    const res = await loginByPhone({
      loginCode: code.value,
      phoneNumberCode: detail.code,
      encryptedData: detail.encryptedData,
      rawData: detail.iv
    });
    loading.value = false;
    if (!res) return;
    appStore.setToken(res);
    await appStore.getUserInfo();
    success = true;
    // reportEvent(ReportKeys.USER_LOGIN, {
    //   is_new_user: 1
    // });
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
      <NButton open-type="getPhoneNumber" @getphonenumber="doLogin">
        点我登录3
      </NButton>
    </NView>
  </PageWrapper>
</template>
