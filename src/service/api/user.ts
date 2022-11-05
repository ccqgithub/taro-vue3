import Taro from '@tarojs/taro';
import { request } from '@/service';

export type LoginResp = {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
};

export const loginByPhone = async (args: {
  loginCode: string;
  phoneNumberCode?: string;
  encryptedData?: string;
  rawData?: string;
}) => {
  console.log(args);
  return Promise.resolve<LoginResp>({
    accessToken: 'ACCESS_TOKEN',
    refreshToken: 'ACCESS_TOKEN',
    expireIn: 7200
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
  return Promise.resolve();
  // return request.get({
  //   url: '/loginOut'
  // });
};

export const getUserInfo = (token?: any) => {
  return Promise.resolve<any>({
    id: '1',
    photo: '',
    nickname: 'Season Chen'
  });
  // return request.get<UserInfo>({
  //   url: '/userinfo'
  // });
};
