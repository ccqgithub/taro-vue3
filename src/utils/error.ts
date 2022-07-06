import { ErrorType } from '@/constants';

export const normalizeError = (
  error: any,
  args: { type?: ErrorType; title?: string; info?: any } = {}
) => {
  if (error instanceof GeneralError) return error;
  let message: string = error.message || error.errMsg || error || '未知错误';
  let type = args.type;
  if (/Failed to fetch/i.test(`${message}`)) {
    message = '请检查您的网络设置后重试';
    type = ErrorType.NET_WORK;
  }
  return new GeneralError(message, { ...args, type, info: error?.info });
};

export class GeneralError extends Error {
  type: ErrorType = ErrorType.ERROR;
  title = '';
  info: any = null;

  constructor(
    message: any,
    args: { type?: ErrorType; title?: string; info?: any } = {}
  ) {
    super(message);
    const { title = '', type = ErrorType.ERROR, info = null } = args;
    this.title = title;
    this.type = type;
    this.info = info;
  }
}

export { ErrorType };
