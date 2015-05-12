var fastly = require('fastly')(process.env.FASTLY_API_KEY);

fastly.purge('titan-web.herokuapp.com', '/', function(err, obj) {
  if (err) return console.dir(err);   // Oh no!
  console.dir(obj);                   // Response body from the fastly API
});
