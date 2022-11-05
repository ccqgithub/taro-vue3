const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const loadEnvs = require('./utils/loadEnvs');
const { createClassNamehash } = require('./utils/createClassNameHash');

const root = process.cwd();
const publicUrl = process.env.TARO_PUBLIC_URL || '/';
const env = loadEnvs();

const config = {
  env: { ...env },
  projectName: 'Taro Vue 3',
  date: '2022-4-20',
  designWidth: 375,
  deviceRatio: {
    375: 2 / 1
  },
  sourceRoot: 'src',
  outputRoot: `dist/${process.env.TARO_ENV_REAL}`,
  compiler: {
    type: 'webpack5',
    prebundle: {
      enable: false
    }
  },
  plugins: [
    [
      '@tarojs/plugin-framework-vue3',
      {
        vueLoaderOption: {
          compilerOptions: {
            preserveWhitespace: false,
            whitespace: 'condense'
          },
          exposeFilename: true,
          reactivityTransform: false
        }
      }
    ],
    [path.resolve(__dirname, './plugins/platform-miniprogram/index.js'), {}],
    [path.resolve(__dirname, './plugins/page-skeleton/index.js'), {}]
  ],
  defineConstants: {
    __VUE_I18N_LEGACY_API__: JSON.stringify(false),
    __VUE_I18N_FULL_INSTALL__: JSON.stringify(false),
    __INTLIFY_PROD_DEVTOOLS__: JSON.stringify(false)
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
    '@intlify/shared': '@intlify/shared/dist/shared.cjs.prod.js',
    '@intlify/core-base': '@intlify/core-base/dist/core-base.cjs.prod.js',
    'vue-i18n': 'vue-i18n/dist/vue-i18n.runtime.esm-bundler.js'
  },
  mini: {
    baseLevel: 32,
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
              prefix: 'm-'
            });
          }
        }
      }
    },
    imageUrlLoaderOption: {
      limit: 0.1 * 1024
    },
    mediaUrlLoaderOption: {
      limit: 0.1 * 1024
    },
    miniCssExtractPluginOption: {
      ignoreOrder: true
    },
    webpackChain(chain, webpack) {
      chain.resolve.mainFields.prepend('module').clear();

      const plugin = {
        intl: {
          plugin: webpack.ProvidePlugin,
          args: [
            {
              Intl: ['@/polyfill/intl-global.ts', 'default']
            }
          ]
        },
        install: {
          plugin: require('terser-webpack-plugin'),
          args: [
            {
              test: /(runtime|vendors|taro)\.js(\?.*)?$/i,
              terserOptions: {
                compress: true, // 默认使用terser压缩
                keep_classnames: false, // 不改变class名称
                keep_fnames: false // 不改变函数名称
              }
            }
          ]
        },
        circular: {
          plugin: CircularDependencyPlugin,
          args: [
            {
              failOnError: false,
              allowAsyncCycles: true
              // onDetected({ paths, compilation }) {
              //   console.log(paths);
              //   compilation.errors.push(new Error(paths.join(' -> ')));
              // }
            }
          ]
        }
      };

      chain.merge({
        performance: {
          hints: false
        },
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
              test: /i18n\/locales\/[^/]*\.(json5?|ya?ml)$/,
              type: 'javascript/auto',
              loader: '@intlify/vue-i18n-loader'
            }
          }
        },
        plugin
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
