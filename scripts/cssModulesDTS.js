const path = require('path');
const less = require('less');
const glob = require('glob');
const fs = require('fs');
const watch = require('node-watch');
const minimatch = require('minimatch');
const DtsCreator = require('typed-css-modules');
const { default: LessPluginAliases } = require('less-plugin-aliases');

const RealDtsCreator = DtsCreator.default;
const root = process.cwd();
const creator = new RealDtsCreator({
  rootDir: root,
  namedExports: true
});

const updateFile = async (f) => {
  try {
    const content = fs.readFileSync(f, 'utf8');
    const lessOut = await less.render(content, {
      filename: f,
      plugins: [
        new LessPluginAliases({
          prefix: '~',
          aliases: {
            '@': path.resolve(__dirname, '../src/')
          }
        })
      ]
    });
    await creator.create(f, lessOut.css, true).then((content) => {
      return content.writeFile();
    });
  } catch (e) {
    console.error(e);
  }
};

watch(
  root,
  {
    recursive: true,
    filter: (f) => minimatch(f, '**/*.module.less')
  },
  (evt, name) => {
    if (evt === 'update') {
      updateFile(name);
    }
  }
);

glob(
  '**/*.module.less',
  {
    cwd: root
  },
  (er, files) => {
    files.forEach((f) => {
      updateFile(path.resolve(root, f));
    });
  }
);
