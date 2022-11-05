export const PickerHeight = 610;

export enum StorageKeys {
  LOGIN_TOKEN = 'LOGIN_TOKEN',
  LOGIN_TOKEN_VERSION = 'LOGIN_TOKEN_VERSION',
  API_ENV = 'API_ENV'
}

export enum ErrorType {
  // 普通错误
  ERROR = 'ERROR',
  // 405 资源冲突
  STATE_CONFLICT = 'STATE_CONFLICT',
  // api error
  API_ERROR = 'API_ERROR',
  // 网络错误
  NET_WORK = 'NET_WORK',
  // token 过期
  UN_AUTHORIZED = 'UN_AUTHORIZED',
  // Not Found
  NOT_FOUND = 'NOT_FOUND'
}
