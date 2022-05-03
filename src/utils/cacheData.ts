export enum CacheKeys {
  //
  BACK_TO_PATH
}

// 缓存数据，用来解决页面间大数据传递，或者解决 switch tab 不能传参数的问题
const cacheData: Map<CacheKeys, any> = new Map();

// cache data
export const setCacheData = (key: CacheKeys, params: any) => {
  cacheData.set(key, params);
};
export const clearCacheData = (key: CacheKeys) => {
  cacheData.delete(key);
};
export const getAndClearData = (key: CacheKeys) => {
  const params = cacheData.get(key);
  cacheData.delete(key);
  return params;
};
export const getCacheData = (key: CacheKeys) => {
  const params = cacheData.get(key);
  return params;
};
