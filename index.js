var express = require('express')
var fs = require('fs');
var gzipStatic = require('connect-gzip-static');

var app = express()
app.use(require('compression'))
app.use(express.static(__dirname + '/dist', {
  etag: true,
  maxAge: 31536000
}))
app.use(require('morgan')('dev'));

var stats = require(__dirname + "/dist/stats.json");
var publicPath = stats.publicPath;
var scriptUrl = publicPath + [].concat(stats.assetsByChunkName.app)[0];

var html = fs.readFileSync("index.html", "utf-8").replace("/bundle.js", scriptUrl);

app.get('*', function (req, res) {
  res.contentType = "text/html; charset=utf8";
  res.end(html);
})

app.listen(process.env.PORT || 5000);
