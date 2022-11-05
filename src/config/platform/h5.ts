import * as envs from '../env';
import { GetConfigs } from '../type';

const getConfigs: GetConfigs = () => {
  const env = envs.appEnv;

  return {
    ...envs,
    apiBaseUrl: envs.apiBaseUrls[env]!,
    h5BaseUrl: envs.h5BaseUrls[env]!,
    extAssetsBaseUrl: envs.extAssetsBaseUrls[env]!
  };
};

export default getConfigs;
