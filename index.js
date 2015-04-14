var express = require('express')
var app = express()
var fs = require('fs');

app.use(express.static(__dirname + '/dist'))

app.get('*', function (req, res) {
  fs.readFile('index.html', function(err, data){
    res.send(data.toString());
  });
})

app.listen(process.env.PORT || 5000);
