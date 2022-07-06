import queryString from 'query-string';

const qrBase = 'https://www.season.cn/qr/';

export const parseQRBooking = (q: string) => {
  const str = decodeURIComponent(q);
  if (str?.indexOf(`${qrBase}booking`) === -1) return null;
  const search = str.split('?')[1];
  const params = queryString.parse(search);
  return {
    id: params.id
  };
};
