export declare type Maybe<T extends Record<string, any>> = {
  [K in keyof T]: T[K] | null;
};

export type User = Maybe<{
  id: string;
  email?: string;
  phone?: string;
  photo?: string;
  token?: string;
  nickname?: string;
}>;

export type GetPhoneRes = {
  countryCode: string;
  phoneNumber: string;
  purePhoneNumber: string;
  openid: string;
  unionid: string;
};

export type IToken = {
  accessToken?: string;
  refreshToken?: string;
  expireIn: number;
};
