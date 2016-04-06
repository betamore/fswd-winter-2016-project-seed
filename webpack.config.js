var path = require('path');

module.exports = {
  cache: true,
  entry: './js/index',
  output: {
    path: __dirname + '/public',
    filename: 'browser-bundle.js'
  },
  resolve: {
    root: [
      path.resolve('./js')
    ]
  },
  module: {
    loaders: []
  }
};
