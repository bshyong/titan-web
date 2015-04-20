var webpack = require('webpack');

module.exports = {
  resolve: {
    modulesDirectories: ['app', 'node_modules']
  },
  entry: {
    app: ['./app/main.jsx']
  },
  output: {
    path: '/dist/',
    filename: 'bundle.js'
  },
  devtool: 'sourcemap',
  plugins: [
    new webpack.DefinePlugin({
      APP_ENV: JSON.stringify(process.env.APP_ENV),
      API_URL: JSON.stringify(process.env.API_URL)
    })
  ],
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loaders: ['babel', 'jsx'], exclude: /node_modules/
      },
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
            'file?hash=sha512&digest=hex&name=[hash].[ext]',
            'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
        ]
      }
    ]
  }
}
