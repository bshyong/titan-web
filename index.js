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
  replace("/commons.js", publicPath + stats.assetsByChunkName.commons)


app.get('*', function (req, res) {

  // hacky way to test which entry point we need to load
  var bundle = stats.assetsByChunkName.changelog
  if (req.url.match(/\/(.*)\/(.*)/)) {
    var bundle = stats.assetsByChunkName.story
  }

  res.send(
    html.replace("/app.js", publicPath + bundle[0]).
        replace("/app.css", publicPath + bundle[1])
  )
})

console.log('listening port='+process.env.PORT+' bundle='+stats.assetsByChunkName.app)

app.listen(process.env.PORT || 5000);
