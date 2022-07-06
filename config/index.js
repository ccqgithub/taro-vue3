const path = require('path');
const getEnvs = require('./utils/getEnvs');
const { createClassNamehash } = require('./utils/createClassNameHash');

const root = process.cwd();
const publicUrl = process.env.TARO_PUBLIC_URL || '/';

const config = {
  env: {
    ...getEnvs()
  },
  projectName: 'taro-vue3',
  date: '2022-4-20',
  designWidth: 375,
  deviceRatio: {
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV_REAL}`,
  plugins: [
    [
      '@tarojs/plugin-framework-vue3',
      {
        mini: {
          compilerOptions: {
            whitespace: 'condense'
          }
        }
      }
    ],
    [path.resolve(__dirname, './plugins/platform-miniprogram/index.js'), {}]
  ],
  defineConstants: {
    __VUE_I18N_LEGACY_API__: JSON.stringify('false'),
    __VUE_I18N_FULL_INSTALL__: JSON.stringify('false'),
    __INTLIFY_PROD_DEVTOOLS__: JSON.stringify('false')
  },
  copy: {
    patterns: [
      {
        from: 'src/assets/static/',
        to: `dist/${process.env.TARO_ENV_REAL}/assets/static/`
      },
      {
        from: 'src/assets/staticIcons/',
        to: `dist/${process.env.TARO_ENV_REAL}/assets/staticIcons/`
      },
      {
        from: 'src/root/',
        to: `dist/${process.env.TARO_ENV_REAL}/`
      }
    ],
    options: {}
  },
  framework: 'vue3',
  alias: {
    '@': path.resolve(__dirname, '../src/'),
    '~@': path.resolve(__dirname, '../src/'),
    'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
  },
  mini: {
    minifyXML: {
      collapseWhitespace: false
    },
    postcss: {
      pxtransform: {
        enable: false
      },
      // 样式引用本地资源内联
      url: {
        enable: true,
        config: {
          // 设定转换尺寸上限: 20K
          limit: 2048
        }
      },
      // css modules 功能开关与相关配置
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: function (name, filename, css) {
            return createClassNamehash({
              root,
              name,
              filename,
              css,
              prefix: 't'
            });
          }
        }
      }
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    webpackChain(chain) {
      chain.resolve.mainFields.prepend('module').clear();
      chain.merge({
        resolve: {
          extensions: [
            '.ts',
            '.tsx',
            '.js',
            '.mjs',
            '.vue',
            '.ts',
            '.less',
            '.scss'
          ],
          enforceExtension: false
        },
        module: {
          rule: {
            mjs: {
              test: /\.mjs$/,
              include: [/node_modules/],
              type: 'javascript/auto'
            },
            i18n: {
              test: /langs\/[^/]*\.(json5?|ya?ml)$/,
              type: 'javascript/auto',
              loader: '@intlify/vue-i18n-loader'
            }
          }
        }
      });
    }
  },
  h5: {
    publicPath: publicUrl,
    staticDirectory: 'static',
    postcss: {
      pxtransform: {
        enable: false
      },
      // css modules 功能开关与相关配置
      cssModules: {
        enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: function (name, filename, css) {
            return createClassNamehash({
              root,
              name,
              filename,
              css,
              prefix: 't'
            });
          }
        }
      }
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'));
  }
  return merge({}, config, require('./prod'));
};
