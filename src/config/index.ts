import getH5Conf from './platform/h5';
import getWeappConf from './platform/weapp';
import { GetConfigs } from './type';

export const getConfig: GetConfigs = () => {
  // 为了在 build 阶段移除 dead code，这里不能通过 envs.type 之类的动态变量判断
  if (process.env.TARO_ENV_REAL === 'weapp') {
    return getWeappConf();
  }

  // 为了在 build 阶段移除 dead code，这里不能通过 envs.type 之类的动态变量判断
  if (process.env.TARO_ENV_REAL === 'h5') {
    return getH5Conf();
  }

  throw new Error(`error platform`);
};
