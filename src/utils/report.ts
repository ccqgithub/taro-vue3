import Taro from '@tarojs/taro';

interface ReportEvents {
  page_view: {
    path: string;
    scene: string;
    query: string;
  };
  open_from_mini_code: {
    path: string;
    scene: string;
    query: string;
  };
  error: {
    error_name: string;
    error_message: string;
    error_title: string;
    error_type: string;
    error_info: string;
    error_stack: string;
    error_position: string;
  };
}

export type ReportKeys = keyof ReportEvents;

const env = Taro.getAccountInfoSync().miniProgram.envVersion;

export const reportEvent = <T extends ReportKeys>(
  key: T,
  data: ReportEvents[T]
) => {
  try {
    try {
      Taro.reportEvent(key, {
        ...(data || {}),
        app_version: env
      });
    } catch (e) {
      Taro.reportAnalytics(key, {
        ...(data || {}),
        app_version: env
      });
    }
  } catch (e: any) {
    console.log(e);
  }
};
