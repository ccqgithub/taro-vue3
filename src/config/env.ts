import Taro, { getAccountInfoSync } from '@tarojs/taro';
import { H5Env, WeappEnv, ApiEnv } from '@/constants';

const sysInfo = Taro.getSystemInfoSync();

// 平台
export const platform = sysInfo.platform;

// 开发状态
export const isDevelopment = process.env.NODE_ENV === 'development';
// build状态
export const isProduction = process.env.NODE_ENV === 'production';
// release
export const isRelease = process.env.TARO_RELEASE === 'true';
// is dev tool
export const isDevtools = platform === 'devtools';

// app 类型：小程序、h5等
export const appType = process.env.TARO_ENV_REAL;
// 是否是微信小程序
export const isWeapp = process.env.TARO_ENV_REAL === 'weapp';
// 是否是h5
export const isH5 = process.env.TARO_ENV_REAL === 'h5';

// h5 build 的环境
export const h5Env: H5Env = (process.env.TARO_H5_ENV || 'prod') as H5Env;

// 微信小程序环境
export const weappEnv: WeappEnv = isWeapp
  ? getAccountInfoSync().miniProgram.envVersion
  : 'release';

// publicUrl
export const publicUrl = process.env.TARO_PUBLIC_URL || '/';

// api 路径
export const apiBaseUrl = process.env.TARO_API_BASE_URL || '';
export const apiBaseUrlDev = process.env.TARO_API_BASE_URL_DEV || '';
export const apiBaseUrlTest = process.env.TARO_API_BASE_URL_TEST || '';
export const apiBaseUrlStaging = process.env.TARO_API_BASE_URL_STAGING || '';
export const apiMockUrl = process.env.TARO_API_MOCK_URL || '';

// h5
export const h5BaseUrl = process.env.TARO_H5_BASE_URL || '';
export const h5BaseUrlDev = process.env.TARO_H5_BASE_URL_DEV || '';
export const h5BaseUrlTest = process.env.TARO_H5_BASE_URL_TEST || '';
export const h5BaseUrlStaging = process.env.TARO_H5_BASE_URL_STAGING || '';

// 外部图片路径
export const extImgBaseUrlProd = process.env.TARO_MP_BASE_URL || '';
export const extImgBaseUrlDev = process.env.TARO_MP_BASE_URL_DEV || '';
export const extImgBaseUrlTest = process.env.TARO_MP_BASE_URL_TEST || '';
export const extImgBaseUrlStaging = process.env.TARO_MP_BASE_URL_STAGING || '';

// api环境
export const apiEnvs: Record<
  ApiEnv,
  { apiBaseUrl: string; h5BaseUrl: string; extImgBaseUrl: string }
> = {
  dev: {
    apiBaseUrl: apiBaseUrlDev,
    h5BaseUrl: h5BaseUrlDev,
    extImgBaseUrl: extImgBaseUrlDev
  },
  test: {
    apiBaseUrl: apiBaseUrlTest,
    h5BaseUrl: h5BaseUrlTest,
    extImgBaseUrl: extImgBaseUrlTest
  },
  staging: {
    apiBaseUrl: apiBaseUrlStaging,
    h5BaseUrl: h5BaseUrlStaging,
    extImgBaseUrl: extImgBaseUrlStaging
  },
  prod: {
    apiBaseUrl: apiBaseUrl,
    h5BaseUrl: h5BaseUrl,
    extImgBaseUrl: extImgBaseUrlProd
  }
};
export const apiEnvKeys = Object.keys(apiEnvs) as ApiEnv[];
