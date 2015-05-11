var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./make-webpack-config')({
  devServer: true
});

// config.devtool = 'sourcemap'
// config.output.filename = 'bundle.js'
// config.output.publicPath = '/'


new WebpackDevServer(webpack(config), {
  debug: true,
  hot: true,
  historyApiFallback: true
}).listen(8080, 'localhost', function (err, result) {
  if (err) {
    console.log(err);
  }

  console.log('Listening at localhost:8080');
});
