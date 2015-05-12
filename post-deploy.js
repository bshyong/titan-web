var fastly = require('fastly')(process.env.FASTLY_API_KEY);

fastly.purgeAll(process.env.FASTLY_SERVICE_ID, function(err, obj) {
  if (err) return console.dir(err);   // Oh no!
  console.dir(obj);                   // Response body from the fastly API
});
