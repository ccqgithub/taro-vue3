export type H5Env = 'dev' | 'test' | 'staging' | 'prod';
export type ApiEnv = 'dev' | 'test' | 'staging' | 'prod';
export type WeappEnv = 'develop' | 'trial' | 'release';

export const PickerHeight = 610;

export enum StorageKeys {
  LOGIN_TOKEN = 'LOGIN_TOKEN',
  LOGIN_TOKEN_VERSION = 'LOGIN_TOKEN_VERSION',
  API_ENV = 'API_ENV'
}

export enum ErrorType {
  // 普通错误
  ERROR,
  // 网络错误
  NET_WORK,
  // token 过期
  UN_AUTHORIZED
}
