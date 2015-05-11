var CompressionPlugin = require("compression-webpack-plugin");
var path = require('path')
var webpack = require('webpack');

module.exports = function makeConfig(options) {
  var publicPath = options.devServer ?
    "/" :
    (process.env.ASSET_HOST || "https://d1b1o966bfdaym.cloudfront.net/");

  var basename = "[name]-[chunkhash]"
  if (options.prerender || options.devServer) {
    basename = "[name]"
  }

  return {
    resolve: {
      modulesDirectories: ['app', 'node_modules']
    },
    entry: {
      app: ['./app/main.jsx'],
      commons: [
        "dropzone",
        "fastclick",
        "flux",
        "immutable",
        "jwt-decode",
        "marked",
        "moment",
        "react",
        "react-router",
        "whatwg-fetch",
        "twemoji",
      ],
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: basename + '.js',
      publicPath: publicPath,
      chunkFilename: basename + '.js'
    },
    plugins: [
      new webpack.DefinePlugin({
        APP_ENV: JSON.stringify(process.env.APP_ENV),
        API_URL: JSON.stringify(process.env.API_URL)
      }),
      function() {
        this.plugin("done", function(stats) {
          require("fs").writeFileSync(
            path.join(__dirname, "dist", "stats.json"),
            JSON.stringify(stats.toJson())
          );
        });
      },
      new CompressionPlugin({
        asset: "{file}.gz",
        algorithm: "gzip",
        regExp: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.optimize.CommonsChunkPlugin(
        "commons",
        options.devServer ? "commons.js" : "commons-[chunkhash].js"
      )
    ],
    module: {
      loaders: [
        {
          test:    /\.jsx$/,
          loaders: ['babel', 'jsx'],
          exclude: /node_modules/
        },
        {
          test:    /\.js$/,
          loaders: ['babel'],
          exclude: /node_modules/
        },
        {
          test:   /\.css$/,
          loader: "style-loader!css-loader!cssnext-loader"
        },
        {
          test:    /\.(jpe?g|png|gif|svg)$/i,
          loaders: [
              'file?hash=sha512&digest=hex&name=[hash].[ext]',
              'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
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
