export * from './user';

export type H5Env = 'dev' | 'test' | 'staging' | 'prod';
export type WeappEnv = 'develop' | 'trial' | 'release';
export type AppEnv = 'dev' | 'test' | 'staging' | 'prod';

export type CancelablePromise<T = any> = Promise<T> & {
  cancel(): void;
};

export type ElementOf<T> = T extends Array<infer E> ? E : never;
