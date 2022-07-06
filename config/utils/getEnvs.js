const dotenv = require('dotenv');
const path = require('path');

let taroEnv = process.env.TARO_ENV;
const prodEnv = process.env.TARO_H5_ENV || 'null';

// 等待 Taro 支持pageMeta：https://github.com/NervJS/taro/pull/10923
// https://github.com/baranwang/tarojs-plugin-platform-miniprogram
if (taroEnv === 'miniprogram') taroEnv = 'weapp';

module.exports = () => {
  let res = {};

  const envs = [
    // 公用 .env
    path.resolve(__dirname, `../../envs/.env`),
    // 类型如：.env.weapp
    path.resolve(__dirname, `../../envs/.env.${taroEnv}`),
    // 同一类型不同 build 环境如：.env.h5.prod
    path.resolve(__dirname, `../../envs/.env.${taroEnv}.${prodEnv}`),
    // local 覆盖 .env.local
    path.resolve(__dirname, `../../envs/.env.local`)
  ];

  for (let env of envs) {
    const result = dotenv.config({
      path: env
    });
    if (!result.error) {
      res = { ...res, ...result.parsed };
    }
  }

  // merge process.env 中以 TARO 开头的变量
  Object.keys(process.env).forEach((key) => {
    if (/(TARO)|(NODE_ENV)/.test(key)) {
      res[key] = process.env[key];
    }
  });

  // stringify
  Object.keys(res).forEach((key) => {
    res[key] = JSON.stringify(res[key]);
  });

  return res;
};
