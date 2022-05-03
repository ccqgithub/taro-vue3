const { Weapp } = require('@tarojs/plugin-platform-weapp');
const { resolve } = require('path');
const { readFileSync, writeFileSync, existsSync } = require('fs');

const defaultOptions = {
  prefix: readFileSync(resolve(__dirname, './template/prefix.wxml')).toString(),
  suffix: readFileSync(resolve(__dirname, './template/suffix.wxml')).toString()
};

export default (ctx, options) => {
  ctx.registerPlatform({
    name: 'miniprogram',
    useConfigName: 'mini',
    async fn({ config }) {
      config.onBuildFinish = ({ stats }) => {
        stats?.compilation?.entries?.forEach((entry) => {
          if (entry.miniType !== 'PAGE') return;

          if (
            options?.include &&
            !options.include.some((pattern) => entry.name.match(pattern))
          ) {
            return;
          }
          if (
            options?.exclude &&
            options.exclude.some((pattern) => entry.name.match(pattern))
          ) {
            return;
          }

          const WxmlFilePath = resolve(
            config?.outputRoot ?? 'dist',
            `${entry.name}.wxml`
          );
          if (!existsSync(WxmlFilePath)) return;
          const WxmlFileContent = readFileSync(WxmlFilePath, 'utf-8');
          let { prefix, suffix } = defaultOptions;
          if (options?.prefix) {
            if (existsSync(options.prefix)) {
              prefix = readFileSync(options.prefix, 'utf-8');
            } else {
              prefix = options.prefix;
            }
          }
          if (options?.suffix) {
            if (existsSync(options.suffix)) {
              suffix = readFileSync(options.suffix, 'utf-8');
            } else {
              suffix = options.suffix;
            }
          }
          writeFileSync(WxmlFilePath, `${prefix}${WxmlFileContent}${suffix}`);
        });
      };

      const program = new Weapp(ctx, config, options || {});
      await program.start();
    }
  });
};
