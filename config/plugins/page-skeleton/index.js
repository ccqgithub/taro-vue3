const path = require('path');
const fs = require('fs');

const htmlExtnameMap = {
  weapp: 'wxml',
  miniprogram: 'wxml',
  swan: 'swan',
  tt: 'ttml',
  alipay: 'axml',
  qq: 'qml'
};

export default (ctx, pluginOpts) => {
  const htmlExtname = htmlExtnameMap[process.env.TARO_ENV];
  const sourcePath = ctx.paths.sourcePath;

  if (!htmlExtname) return;

  ctx.modifyBuildAssets(({ assets }) => {
    const pages =
      pluginOpts.pages || JSON.parse(assets['app.json'].source()).pages;

    pages.forEach((pagePath) => {
      const skeletonPath = path.resolve(
        sourcePath,
        `${pagePath}.skeleton.wxml`
      );
      const onlyShowSkeletonView = JSON.parse(
        assets[pagePath + `.json`].source()
      ).onlyShowSkeletonView;

      try {
        const skeletonTmpData = fs.readFileSync(skeletonPath, 'utf-8');
        const htmlPath = pagePath + `.${htmlExtname}`;
        const pageTmpAsset = assets[htmlPath];
        const res = onlyShowSkeletonView
          ? skeletonTmpData
          : `${pageTmpAsset.source()}\n${skeletonTmpData}`;

        assets[htmlPath] = {
          size: () => res.length,
          source: () => res
        };
      } catch (_error) {
        // console.log(_error);
      }

      const skeletonKeepPath = path.resolve(
        sourcePath,
        `${pagePath}.skeleton.keep.wxml`
      );
      try {
        const skeletonTmpData = fs.readFileSync(skeletonKeepPath, 'utf-8');
        const htmlPath = pagePath + `.${htmlExtname}`;
        const pageTmpAsset = assets[htmlPath];
        const res = `${pageTmpAsset.source()}\n${skeletonTmpData}`;

        assets[htmlPath] = {
          size: () => res.length,
          source: () => res
        };
      } catch (_error) {
        // console.log(_error);
      }
    });
  });
};
