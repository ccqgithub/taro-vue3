import Taro from '@tarojs/taro';
import { debug, normalizeError } from '@/utils';

export enum ReportKeys {
  PAGE_VIEW = 'page_view',
  OPEN_FROM_MINI_CODE = 'open_from_mini_code',
  USER_LOGIN = 'user_login'
}

export const reportEvent = (
  key: ReportKeys,
  data: Record<string, any> = {}
) => {
  debug('reportEvent:', [key, data]);
  try {
    try {
      Taro.reportEvent(key, data);
    } catch (e) {
      Taro.reportAnalytics(key, data);
    }
  } catch (e) {
    debug('reportEvent error:', normalizeError(e).message);
  }
};
