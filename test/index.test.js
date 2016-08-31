var test = require('tape');
var jgeo = require('../lib/index');

test('it converts an object to a GeoJSON feature', function (t) {
  var obj = require('./fixtures/government-dataset.json');
  var found = jgeo.toGeoJSON(obj);
  var coords = [-115.469582, 32.641719];

  t.equal(found.type, 'Feature', 'is a GeoJSON feature');
  t.equal(found.geometry.type, 'Point', 'builds Point geometries');
  t.equal(found.properties.producto, 'TORTILLA DE MAIZ', 'keeps properties');
  t.deepEqual(found.geometry.coordinates, coords, 'finds coordinates');

  var venues = require('./fixtures/foursquare-venues.json').response.venues;
  var getCoordinates = (o) => [o.location.lng, o.location.lat];
  var v = jgeo.toGeoJSON(venues[0], getCoordinates);

  t.equal(v.properties.location.city, 'Brooklyn', 'deep copy of properties');
  t.equal(v.geometry.coordinates[0], -73.99389265510275, 'venue longitude');
  t.equal(v.properties.categories[0].name, 'Park', 'keeps properties');

  t.end();
});
