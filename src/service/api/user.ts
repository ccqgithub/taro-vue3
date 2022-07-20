import Taro from '@tarojs/taro';
import { request } from '@/service';
import { User } from '@/types';

export type LoginResp = {
  accessToken: string;
  refreshToken: string;
  expireIn: number;
};

export const loginByCode = async () => {
  try {
    const { code } = await Taro.login();
    console.log(code);
    return Promise.resolve<LoginResp>({
      accessToken: 'ACCESS_TOKEN',
      refreshToken: 'ACCESS_TOKEN',
      expireIn: 7200
    });
    // return request.post<LoginResp>({
    //   url: '/login',
    //   data: params,
    //   noToken: true
    // });
  } catch (e: any) {
    if (e.info?.code === 401) {
      return null;
    }
    throw e;
  }
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

export const getUserInfo = () => {
  return Promise.resolve<User>({
    id: '1',
    photo: '',
    nickname: 'Season Chen'
  });
  // return request.get<UserInfo>({
  //   url: '/userinfo'
  // });
};
