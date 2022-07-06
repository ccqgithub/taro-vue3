import Taro from '@tarojs/taro';
import { StorageKeys, ApiEnv, WeappEnv } from '@/constants';
import * as envs from '../env';
import { GetConfigs } from '../type';

// 小程序环境和 api 环境映射
const envMap: Record<WeappEnv, ApiEnv> = {
  develop: envs.isRelease ? 'staging' : 'test',
  trial: envs.isRelease ? 'staging' : 'test',
  release: 'prod'
};

const getConfigs: GetConfigs = () => {
  let env: ApiEnv = envMap[envs.weappEnv] || 'prod';
  // 开启调试的状态
  const systemInfo = Taro.getSystemInfoSync();
  if (systemInfo.enableDebug) {
    const storeEnv = Taro.getStorageSync(StorageKeys.API_ENV) as ApiEnv;
    if (storeEnv && envs.apiEnvs[storeEnv]) {
      env = storeEnv;
    }
  }

  return {
    ...envs,
    ...envs.apiEnvs[env],
    apiEnv: env
  };
};

export default getConfigs;
