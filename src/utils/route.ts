import Taro from '@tarojs/taro';
import querystring from 'query-string';
import { AppRoutes, getRelativeRoutePath, getRoutePath } from '@/app.config';
import { CacheKeys, setCacheData } from '@/utils/cacheData';
import { getH5Url } from '@/utils/h5';
import { i18n } from '@/i18n';

export const backToPath = (p: string) => {
  const path = p.replace(/^\/+/, '');
  const pages = Taro.getCurrentPages();
  const urls = pages.map((item) => item.route);
  let index = 0;
  for (let i = urls.length - 1; i >= 0; i--) {
    if (urls[i]?.indexOf(path) === 0) index = i;
  }
  const delta = pages.length - index - 1;
  Taro.navigateBack({ delta });
};

// 返回到最近的指定页面
export const backToPage = (key: keyof typeof AppRoutes) => {
  const path = getRelativeRoutePath(AppRoutes[key]);
  backToPath(path);
};

// 返回最近的tab页，然后跳转指定页面
export const backAndGotoPath = async (path: string) => {
  const pages = Taro.getCurrentPages();

  if (pages.length > 1) {
    setCacheData(CacheKeys.BACK_TO_PATH, path);
    await Taro.navigateBack({ delta: pages.length - 1 });
    return;
  }

  await Taro.reLaunch({
    url: path
  });
};

export const getH5Path = (
  key: Parameters<typeof getH5Url>[0],
  params?: Record<string, string | number>,
  hash?: string
) => {
  let h5 = getH5Url(key);
  const p = {
    lang: i18n.global.locale.value,
    ...params
  };
  h5 = `${h5}?${querystring.stringify(p)}`;
  if (hash) h5 = `${h5}#${hash}`;
  return `${getRoutePath(AppRoutes.h5)}?url=${encodeURIComponent(h5)}`;
};

export const getH5PathWithUrl = (
  url: string,
  params?: Record<string, string | number>
) => {
  const search = url.split('?')[1] || '';
  const urlPath = url.split('?')[0];
  const urlParams = querystring.parse(search);
  const p = {
    lang: i18n.global.locale.value,
    ...urlParams,
    ...params
  };
  const h5 = `${urlPath}?${querystring.stringify(p)}`;
  return `${getRoutePath(AppRoutes.h5)}?url=${encodeURIComponent(h5)}`;
};
