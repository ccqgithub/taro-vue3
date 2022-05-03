import { ApiEnv } from '@/constants';
import * as envs from './env';

export type Configs = typeof envs & {
  apiBaseUrl: string;
  extImgBaseUrl: string;
  apiEnv: ApiEnv;
  apiEnvKeys: ApiEnv[];
};

export type GetConfigs = () => Configs;
