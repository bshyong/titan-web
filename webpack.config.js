module.exports = {
  entry: {
    app: ['./app/main.jsx']
  },
  output: {
    path: './dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loaders: ['babel', 'jsx'], exclude: /node_modules/ },
      { test: /\.js$/, loaders: ['babel'], exclude: /node_modules/ },
      { test: /\.css$/, loader: 'style-loader!css-loader' }
    ]
  }
}
