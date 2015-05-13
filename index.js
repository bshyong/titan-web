var express = require('express')
var fs = require('fs');
var gzipStatic = require('connect-gzip-static');

var app = express()
app.use(gzipStatic(__dirname + '/dist', {
  maxAge: 31536000
}))
app.use(require('morgan')('dev'));

var stats = require(__dirname + "/dist/stats.json");
var publicPath = stats.publicPath;

var html = fs.readFileSync("index.html", "utf-8").
  replace("/app.js", publicPath + stats.assetsByChunkName.app[0]).
  replace("/app.css", publicPath + stats.assetsByChunkName.app[1]).
  replace("/commons.js", publicPath + stats.assetsByChunkName.commons)

app.get('*', function (req, res) {
  res.send(html);
})

console.log('listening port='+process.env.PORT+' bundle='+stats.assetsByChunkName.app)

app.listen(process.env.PORT || 5000);
