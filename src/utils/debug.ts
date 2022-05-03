import { getSystemInfo } from '@/constants';

export const debug = (
  type: string,
  message: any,
  level: 'log' | 'info' | 'warn' | 'error' = 'log'
) => {
  try {
    // 未打开 debug 模式
    const sysInfo = getSystemInfo();
    if (!sysInfo.enableDebug) return;
    if (typeof console !== 'object') return;
    let messages = typeof message === 'function' ? message() : message;
    messages = Array.isArray(messages) ? messages : [messages];
    console.log(`[${type}]:`);
    for (const msg of messages) {
      console[level] && console[level](msg);
    }
  } catch (e) {}
};
