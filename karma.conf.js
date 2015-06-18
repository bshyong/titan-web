// https://github.com/justinwoo/react-karma-webpack-testing/blob/master/karma.conf.js
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

var webpackConfig = {
  devtool: 'inline-source-map',
  module: {
    loaders: [
      {
        test:    /\.jsx?$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test:   /\.css$/,
        loader: ExtractTextPlugin.extract('css-loader!cssnext-loader'),
      },
      {
        test:    /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      },
      {
        test:    /favicon\.ico$/i,
        loaders: ['file?name=favicon.ico']
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      APP_ENV: JSON.stringify(process.env.APP_ENV),
      API_URL: JSON.stringify(process.env.API_URL),
      MAIN_HOST: JSON.stringify(process.env.MAIN_HOST || 'assembly.test'),
      RR_URL: JSON.stringify(process.env.RR_URL || 'https://readraptor.com'),
      'process.env.NODE_ENV': JSON.stringify('test')
    }),
    new ExtractTextPlugin('[name]-[chunkhash].css')
  ]
}

module.exports = function(config) {
  config.set({
    browserNoActivityTimeout: 30000,
    browsers: ['Chrome'],
    singleRun: !!process.env.CONTINUOUS_INTEGRATION,
    frameworks: ['jasmine'],
    files: ['node_modules/jasmine-ajax/lib/mock-ajax.js', 'tests.webpack.js'],
    preprocessors: {
      'tests.webpack.js': ['webpack', 'sourcemap']
    },
    reporters: ['dots'],
    webpack: webpackConfig,
    webpackServer: {
      noInfo: true
    }
  })
}
