import EventEmitter from 'eventemitter3';

export enum EventKeys {
  // 登录返回: { success: true }
  LoginBack = 'login:back'
}

// 全局 event bus
export const eventBus = new EventEmitter();
