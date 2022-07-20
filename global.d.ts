/// <reference path="node_modules/@tarojs/plugin-platform-weapp/types/index.d.ts" />

declare module '*.png';
declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg';
declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.styl';

declare namespace NodeJS {
  interface ProcessEnv extends CustomProcessEnv {
    TARO_ENV:
      | 'weapp'
      | 'swan'
      | 'alipay'
      | 'h5'
      | 'rn'
      | 'tt'
      | 'quickapp'
      | 'qq'
      | 'jd';
    readonly TARO_AUTHING_APP_ID: string;
  }
}

declare module '@tarojs/components' {
  export * from '@tarojs/components/types/index.vue3';
}
