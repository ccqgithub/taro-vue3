// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    [
      'taro',
      {
        framework: 'vue3',
        ts: true,
        targets: {
          ios: '10',
          android: '6',
          chrome: '80',
          safari: '10',
          firefox: '80',
          edge: '20'
        }
      }
    ]
  ]
};
