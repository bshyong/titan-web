var AWS = require('aws-sdk');
var cloudfront = new AWS.CloudFront();
var stats = require(__dirname + "/dist/stats.json");

var params = {
  DistributionId: 'EFI6XFIBVMT0I',
  InvalidationBatch: {
    CallerReference: stats.assetsByChunkName.app,
    Paths: {
      Quantity: 1,
      Items: ['/',]
    }
  }
};

cloudfront.createInvalidation(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});
