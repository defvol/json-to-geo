var fs = require('fs');
var jgeo = require('./lib/index');

var accessor = (o) => [ o.location.lng, o.location.lat ];
var venues = __dirname + '/test/fixtures/foursquare-venues.json';
var rs = fs.createReadStream(venues);
jgeo.transform({
  readable: rs,
  path: 'response.venues.*',
  getCoordinates: accessor
}).pipe(process.stdout);
