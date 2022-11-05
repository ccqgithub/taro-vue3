import { AppEnv } from '@/types';

//A=a:b,c:d,e:f = { a: b, c: d, e: f }
export const parseMulti = (str: string) => {
  const arr = str.split(',');
  const res: Record<string, string> = {};
  for (const val of arr) {
    const key = val.replace(/^(\w+):.+$/, '$1');
    const v = val.replace(/^(\w+):/, '');
    res[key] = v;
  }
  return res;
};

// 开发状态
export const isDevelopment = process.env.NODE_ENV === 'development';
// build状态
export const isProduction = process.env.NODE_ENV === 'production';

// app 类型：小程序、h5等
export const appType = process.env.TARO_ENV_REAL;
// 是否是微信小程序
export const isWeapp = process.env.TARO_ENV_REAL === 'weapp';
// 是否是h5
export const isH5 = process.env.TARO_ENV_REAL === 'h5';

// publicUrl
export const publicUrl = process.env.TARO_PUBLIC_URL || '/';

// api 路径
export const apiBaseUrls = parseMulti(process.env.TARO_API_BASE_URL || '');

// h5
export const h5BaseUrls = parseMulti(process.env.TARO_H5_BASE_URL || '');

// 外部图片路径
export const extAssetsBaseUrls = parseMulti(
  process.env.TARO_EXT_ASSETS_BASE_URL || ''
);

// mock
export const apiMockUrl = process.env.TARO_API_MOCK_URL || '';

// app env keys
export const appEnvs = (process.env.TARO_APP_ENVS || '').split(',') as AppEnv[];
export const appEnv = (process.env.TARO_APP_ENV || 'prod') as AppEnv;
