import { joinUrl } from '@/utils/url';
import { getConfig } from '@/config';

const urls = {
  faq: '/faq'
};

export const getH5Url = (type: keyof typeof urls) => {
  const conf = getConfig();
  return joinUrl(conf.h5BaseUrl, urls[type]);
};
