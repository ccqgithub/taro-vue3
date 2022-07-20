import Taro, { getAccountInfoSync } from '@tarojs/taro';
import { StorageKeys } from '@/constants';
import { AppEnv, WeappEnv } from '@/types';
import * as envs from '../env';
import { GetConfigs } from '../type';

// 小程序环境和 api 环境映射
const envMap: Record<WeappEnv, AppEnv> = {
  develop: 'dev',
  trial: 'test',
  release: 'prod'
};

const getConfigs: GetConfigs = () => {
  const weappEnv = getAccountInfoSync().miniProgram.envVersion;
  let env: AppEnv = envMap[weappEnv] || 'prod';

  // 开启调试的状态
  const systemInfo = Taro.getSystemInfoSync();
  if (systemInfo.enableDebug) {
    const storeEnv = Taro.getStorageSync(StorageKeys.API_ENV) as AppEnv;
    if (storeEnv && envs.appEnvs.includes(storeEnv)) {
      env = storeEnv;
    }
  }

  return {
    ...envs,
    apiBaseUrl: envs.apiBaseUrls[env],
    h5BaseUrl: envs.h5BaseUrls[env],
    extAssetsBaseUrl: envs.extAssetsBaseUrls[env]
  };
};

export default getConfigs;
