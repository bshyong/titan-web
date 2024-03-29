var CompressionPlugin = require('compression-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var path = require('path')
var webpack = require('webpack')

require('dotenv').load()

module.exports = function makeConfig(options) {
  var publicPath = options.devServer ?
    '/' :
    (process.env.ASSET_HOST || 'https://d1b1o966bfdaym.cloudfront.net/');

  var basename = '[name]-[chunkhash]'
  if (options.prerender || options.devServer) {
    basename = '[name]'
  }

  return {
    resolve: {
      modulesDirectories: ['node_modules', 'app']
    },
    entry: {
      app: ['./app/main.jsx'],
      commons: [
        'dropzone',
        'flux',
        'immutable',
        'jwt-decode',
        'marked',
        'moment',
        'react',
        'react-router',
        'whatwg-fetch',
        'twemoji',
      ],
    },
    devtool: options.devServer ? 'sourcemap' : undefined,
    output: {
      path: path.join(__dirname, 'dist'),
      filename: basename + '.js',
      publicPath: publicPath,
      chunkFilename: basename + '.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: options.devServer ? true : false,
        API_URL: JSON.stringify(process.env.API_URL),
        APP_ENV: JSON.stringify(process.env.APP_ENV),
        GIPHY_API_KEY: JSON.stringify(process.env.GIPHY_API_KEY),
        MAIN_HOST: JSON.stringify(process.env.MAIN_HOST),
        RR_URL: JSON.stringify(process.env.RR_URL || 'https://readraptor.com'),
        S3_URL: JSON.stringify(process.env.S3_URL || 'https://s3.amazonaws.com/titan-api'),
      }),
      function() {
        this.plugin('done', function(stats) {
          require('fs').writeFileSync(
            path.join(__dirname, 'dist', 'stats.json'),
            JSON.stringify(stats.toJson())
          );
        });
      },
      new CompressionPlugin({
        asset: '{file}.gz',
        algorithm: 'gzip',
        regExp: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.optimize.CommonsChunkPlugin(
        'commons',
        options.devServer ? 'commons.js' : 'commons-[chunkhash].js'
      ),
      new ExtractTextPlugin(basename + '.css')
    ],
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
          loaders: [
              'file?name=favicon.ico'
          ]
        }
      ]
    },
    cssnext : {
      features : {
        import : {
          path : ['src/stylesheets']
        }
      }
    }
  }
}
