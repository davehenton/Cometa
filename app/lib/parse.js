// Modules
const path = require('path');

// Libraries
const { formats } = require('../config');

const output = (data) => {
  const { query } = data;
  const outputQuality = parseInt(query.q, 10) || 80;
  const validQuality = outputQuality * (outputQuality - 101) < 0;

  return {
    output: {
      width: parseInt(query.w, 10) || null,
      height: parseInt(query.h, 10) || null,
      quality: validQuality ? outputQuality : 80,
      extension: data.extension
    },
    provider: data.provider.toUpperCase(),
    input: data.input
  };
};

module.exports = (req) => {
  const { query } = req;
  const fileName = path.basename(req.path).split('.');
  let extension = fileName.pop();
  const supportedOutput = formats.output.includes(extension);
  const supportedInput = formats.input.includes(fileName.pop());

  let input = req.path;
  if (supportedInput && supportedOutput) {
    input = req.path.replace(`.${extension}`, '');
  } else if (!supportedOutput) {
    extension = new Error(`.${extension} files are not supported.`);
  }

  const { provider = '' } = req.params;
  return output({
    query,
    input,
    provider,
    extension
  });
};
