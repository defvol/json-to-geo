var test = require('tape');
var jgeo = require('../lib/index');
var fs = require('fs');
var Writable = require('stream').Writable;

var venues = require('./fixtures/foursquare-venues.json').response.venues;
var getCoordinates = (o) => [ o.location.lng, o.location.lat ];
var isFloat = (f) => f.toString().match(/\d+\.\d+/);

test('it converts an object to a GeoJSON feature', function (t) {
  var obj = require('./fixtures/government-dataset.json');
  var found = jgeo.toGeoJSON(obj);
  var coords = [-115.469582, 32.641719];

  t.equal(found.type, 'Feature', 'is a GeoJSON feature');
  t.equal(found.geometry.type, 'Point', 'builds Point geometries');
  t.equal(found.properties.producto, 'TORTILLA DE MAIZ', 'keeps properties');
  t.deepEqual(found.geometry.coordinates, coords, 'finds coordinates');

  var v = jgeo.toGeoJSON(venues[0], getCoordinates);

  t.equal(v.properties.location.city, 'Brooklyn', 'deep copy of properties');
  t.equal(v.geometry.coordinates[0], -73.99389265510275, 'venue longitude');
  t.equal(v.properties.categories[0].name, 'Park', 'keeps properties');

  t.end();
});

test('it transforms a stream of objects to GeoJSON features', function (t) {
  t.plan(90);

  var inNY = (s) => (['NY', 'New York'].indexOf(s) >= 0);
  var ws = new Writable;

  ws._write = function (chunk, enc, next) {
    var obj = JSON.parse(chunk);
    t.equal(obj.type, 'Feature', 'GeoJSON feature coming from the stream');
    t.true(isFloat(obj.geometry.coordinates[1]), 'Finds it latitude');
    t.true(inNY(obj.properties.location.state), 'Preserves properties');

    next();
  };

  var rs = fs.createReadStream(__dirname + '/fixtures/foursquare-venues.json');
  jgeo.transform({
    readable: rs,
    path: 'response.venues.*',
    getCoordinates: getCoordinates
  }).pipe(ws);
});

test('it transforms a stream of line-delimited objects', function (t) {
  t.plan(20);

  var ws = new Writable;

  ws._write = function (chunk, enc, next) {
    var obj = JSON.parse(chunk);

    t.equal(obj.type, 'Feature', 'GeoJSON feature coming from the stream');
    t.true(isFloat(obj.geometry.coordinates[1]), 'Finds it latitude');

    next();
  };

  var rs = fs.createReadStream(__dirname + '/fixtures/gpx.ndjson');
  jgeo.transform({
    readable: rs,
    isLineDelimited: true
  }).pipe(ws);
});

test('it builds accessor functions from paths', function (t) {
  var accessor = jgeo.buildAccessor('location.lng', 'location.lat');
  var found = accessor(venues[0]);
  var wants = [ -73.99389265510275, 40.70303245363086 ];
  t.deepEqual(found, wants, 'the accessor finds deep properties');

  t.end();
});

test('it finds geometry type', function (t) {
  var type = jgeo.inferGeometryType;
  t.notOk(type(42), 'invalid coordinates perhaps');
  t.equal(type([42]), 'Point', 'probably a Point');
  t.equal(type([[42]]), 'LineString', 'could be a LineString');
  t.equal(type([[[42]]]), 'Polygon', 'or a Polygon');
  t.end();
});

test('it can build features other than Point', function (t) {
  var obj = require('./fixtures/geometries.json');
  var found = obj.shapes.map(s => jgeo.toGeoJSON(s, o => o.coordinates));
  var coords = [
    [
      -119.86083984375,
      35.89795019335754
    ],
    [
      -120.59692382812499,
      36.62434536776987
    ]
  ];

  t.equal(found[0].type, 'Feature', 'is a GeoJSON feature');
  t.equal(found[0].geometry.type, 'LineString', 'builds LineString');
  t.equal(found[0].properties.type, 'Road', 'keeps properties');
  t.deepEqual(found[0].geometry.coordinates, coords, 'finds coordinates');

  t.equal(found[1].type, 'Feature', 'is a GeoJSON feature');
  t.equal(found[1].geometry.type, 'Polygon', 'builds Polygon');
  t.equal(found[1].properties.type, 'AOI', 'keeps properties');

  t.end();
});
