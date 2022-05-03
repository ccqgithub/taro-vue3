export type CancelablePromise<T = any> = Promise<T> & {
  cancel(): void;
};

export type IToken = {
  accessToken: string;
  tokenType: string;
  refreshToken: string;
};

export type ElementOf<T> = T extends Array<infer E> ? E : never;
