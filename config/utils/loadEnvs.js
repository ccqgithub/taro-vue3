const dotenv = require('dotenv');
const path = require('path');

let taroEnv = process.env.TARO_ENV;
const nodeDev = process.env.NODE_ENV || 'production';

// 等待 Taro 支持pageMeta：https://github.com/NervJS/taro/pull/10923
// https://github.com/baranwang/tarojs-plugin-platform-miniprogram
if (taroEnv === 'miniprogram') taroEnv = 'weapp';

module.exports = () => {
  const envs = [
    path.resolve(__dirname, `../../envs/.env.${taroEnv}.local`),
    path.resolve(__dirname, `../../envs/.env.local`),
    path.resolve(__dirname, `../../envs/.env.${taroEnv}.${nodeDev}`),
    path.resolve(__dirname, `../../envs/.env.${taroEnv}`),
    path.resolve(__dirname, `../../envs/.env`)
  ];

  for (const env of envs) {
    dotenv.config({
      path: env,
      override: false
    });
  }

  const res = {};

  // merge process.env 中以 TARO 开头的变量
  Object.keys(process.env).forEach((key) => {
    if (/(TARO)|(NODE_ENV)/.test(key)) {
      res[key] = JSON.stringify(process.env[key]);
    }
  });

  return res;
};
