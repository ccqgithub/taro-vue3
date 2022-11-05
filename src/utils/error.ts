import Taro from '@tarojs/taro';
import { ErrorType } from '@/constants/com';
import { reportEvent } from './report';

export const normalizeError = (
  error: any,
  args: { type?: ErrorType; title?: string; info?: any; pos?: string } = {},
  pos = ''
): GeneralError => {
  if (!error) return error;

  if (error instanceof GeneralError) return error;

  let message: string = error.message || error.errMsg || error || '未知错误';
  let type = args.type;
  const info = args.info || error.info;

  if (/Failed to fetch/i.test(`${message}`)) {
    message = '请检查您的网络设置后重试';
    type = ErrorType.NET_WORK;
  }

  return new GeneralError(
    message,
    { ...args, type, info },
    args.pos || pos || ''
  );
};

const logger = Taro.getRealtimeLogManager();
const env = Taro.getAccountInfoSync().miniProgram.envVersion;

export class GeneralError extends Error {
  type: ErrorType = ErrorType.ERROR;
  title = '';
  info: any = null;
  pos = '';

  constructor(
    message: any,
    args: { type?: ErrorType; title?: string; info?: any; pos?: string } = {},
    pos = ''
  ) {
    super(message);

    const { title = '', type = ErrorType.ERROR, info = null } = args;

    this.title = title;
    this.type = type;
    this.info = info;
    this.pos = args.pos || pos || '';

    reportEvent('error', {
      error_name: `${this.name}`,
      error_message: `${this.message}`,
      error_title: `${this.title}`,
      error_type: `${this.type}`,
      error_info: JSON.stringify(this.info || {}),
      error_stack: ``,
      error_position: this.pos
    });

    try {
      logger.setFilterMsg(`env:${env}`);
      logger.addFilterMsg(this.message);
      logger.error(`[${this.message}] [${this.type}] [${this.pos}]`);
      logger.error(JSON.stringify(this.info || {}));
      logger.error(`${this.stack}`);
    } catch (e) {}
  }
}

export { ErrorType };
