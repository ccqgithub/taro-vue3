const path = require('path');
const crypto = require('crypto');

const cacheNames = {};

const getUniqueName = (content, p) => {
  const hash = crypto.createHash('md5');
  hash.update(content);
  const hashText = hash.digest('hex').substring(0, 5);
  // new
  if (!cacheNames[hashText]) {
    cacheNames[hashText] = p;
    return hashText;
  }
  // self
  if (cacheNames[hashText] === p) return hashText;
  // repeated
  return getUniqueName(`${content}~1`, p);
};

exports.createClassNamehash = (args) => {
  const { root, name, filename, prefix } = args;
  const p = path.relative(root, filename).replace(/\\/g, '/');
  const basename = path
    .basename(filename)
    .replace(/\.(css|less)/, '')
    .replace(/\./g, '_');
  const content = `${prefix}-${basename}__${p}___${name}`;
  const hash = getUniqueName(content, p).substring(0, 5);
  const cls = `${basename}_${name}__${hash}`;
  return prefix ? `${prefix}-${cls}` : cls;
};
