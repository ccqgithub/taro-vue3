import Taro from '@tarojs/taro';
import { request } from '@/service';
import { GeneralError } from '@/utils';

export type LoginParams = {
  code: string;
  iv?: string | null;
  encryptedData?: string | null;
};

export type LoginResp = {
  accountId: string;
  tokenType: string;
  refreshToken: string;
  expireIn: number;
  accessToken: string;
  bindPhoneNumber: boolean;
};

export const login = (params: LoginParams) => {
  return Promise.resolve<LoginResp>({
    accountId: 'string',
    tokenType: 'string',
    refreshToken: 'string',
    expireIn: 1111111111,
    accessToken: 'string',
    bindPhoneNumber: false
  });
  // return request.post<LoginResp>({
  //   url: '/login',
  //   data: params,
  //   noToken: true
  // });
};

export const wechatLogin = async () => {
  return Promise.resolve<LoginResp>({
    accountId: 'string',
    tokenType: 'string',
    refreshToken: 'string',
    expireIn: 1111111111,
    accessToken: 'string',
    bindPhoneNumber: false
  });
  // const res = await Taro.login();
  // if (!res.code) throw new GeneralError(res.errMsg);
  // const result = await request.post<LoginResp>({
  //   url: '/login',
  //   data: { code: res.code },
  //   noToken: true
  // });
  // return result;
};

export const logout = () => {
  return request.get({
    url: '/loginOut'
  });
};

export type UserInfoParams = {
  nickname?: string;
  email?: string;
  orderId?: string;
  avatarUrl?: string;
};

export type UserInfo = {
  id: string;
  avatarUrl: string | null;
  nickname: string | null;
};

export const getUserInfo = () => {
  return Promise.resolve<UserInfo>({
    id: '1',
    avatarUrl: '',
    nickname: 'Season Chen'
  });
  // return request.get<UserInfo>({
  //   url: '/userinfo'
  // });
};
