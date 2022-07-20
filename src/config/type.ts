import { AppEnv } from '@/types';
import * as envs from './env';

export type Configs = typeof envs & {
  apiBaseUrl: string;
  h5BaseUrl: string;
  extAssetsBaseUrl: string;
  appEnv: AppEnv;
  appEnvs: AppEnv[];
};

export type GetConfigs = () => Configs;
