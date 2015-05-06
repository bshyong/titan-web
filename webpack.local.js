// Use this if you want to test the production server locally

var config = require('./webpack.config');

config.devtool = 'sourcemap'
config.output.filename = 'bundle.js'
config.output.publicPath = '/'

module.exports = config
