import { ExtractPropTypes, ExtractDefaultPropTypes } from 'vue';

export type TPoint = { latitude: number; longitude: number };

export type H5Env = 'dev' | 'test' | 'staging' | 'prod';
export type WeappEnv = 'develop' | 'trial' | 'release';
export type AppEnv = 'dev' | 'test' | 'staging' | 'prod';

export type CancelablePromise<T = any> = Promise<T> & {
  cancel(): void;
};

export type ElementOf<T> = T extends Array<infer E> ? E : never;

type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
type PartialBy<T, K> = Omit<T, K> & Partial<T>;
type Writeable<T> = { -readonly [P in keyof T]: T[P] };

export type TypeFromProps<T extends Record<string, any>> = Writeable<
  PartialBy<ExtractPropTypes<T>, keyof ExtractDefaultPropTypes<T>>
>;

export type Kebab<
  T extends string,
  A extends string = ''
> = T extends `${infer F}${infer R}`
  ? Kebab<
      R,
      `${A}${F extends Lowercase<F>
        ? ''
        : A extends ''
        ? ''
        : '-'}${Lowercase<F>}`
    >
  : A;

export type KebabRecord<O extends Record<string, any>, Keys = keyof O> = {
  [K in Keys as Kebab<string & K>]: O[string & K];
};

export type Timer = ReturnType<typeof setTimeout>;

export * from './user';
