const path = require('./static/text/');

module.exports = {
  output: {
    filename: 'usb_ids.txt',
  },
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader' }],
  },
};