const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

const parse = async () => {
  const envDir = path.resolve(__dirname, '../envs/');
  const dirs = await fs.promises.readdir(envDir);

  let str = 'interface CustomProcessEnv {\n';
  for (let dir of dirs) {
    const f = path.join(envDir, dir);
    const conf = dotenv.config({
      path: f
    });
    Object.keys(conf.parsed).forEach((key) => {
      str += `  readonly ${key}: string;\n`;
    });
  }
  str += '}\n';

  const distFile = path.resolve(__dirname, '../env.d.ts');
  await fs.promises.writeFile(distFile, str);
};

parse();
