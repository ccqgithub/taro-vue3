import * as envs from '../env';
import { GetConfigs } from '../type';

const getConfigs: GetConfigs = () => {
  return {
    ...envs,
    ...envs.apiEnvs[envs.h5Env],
    apiEnv: envs.h5Env
  };
};

export default getConfigs;
