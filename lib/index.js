var JSONStream = require('JSONStream');
var prop = require('lodash.property');
var through2 = require('through2');

module.exports = {
  buildAccessor: buildAccessor,
  findCoordinates: findCoordinates,
  toGeoJSON: toGeoJSON,
  transform: transform
};

/**
 * Return a GeoJSON point feature
 * Optional coordinates function can be used to extract lat and lng from
 * deep properties.
 *
 * @param {object} obj
 * @param {function} getCoordinates
 * @return {object} GeoJSON point feature
 */
function toGeoJSON(obj, getCoordinates) {
  var coords = (!getCoordinates) ? findCoordinates(obj) : getCoordinates(obj);
  var feature = {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: coords
    }
  };
  return Object.assign(feature, { properties: obj });
}

/**
 * Best effort to find longitude and latitude properties
 * Return null island if failed
 *
 * @param {object} obj
 * @return {array} coords
 */
function findCoordinates(obj) {
  return [
    parseFloat(obj.lng || obj.longitude || obj.longitud || obj.lon || 0),
    parseFloat(obj.lat || obj.latitude || obj.latitud || 0)
  ];
}

/**
 * Transform a stream of objects into GeoJSON features
 *
 * @param {stream} readable
 * @param {string} path to array of objects to transform
 * @param {function} getCoordinates
 * @return {stream} transform stream
 */
function transform(readable, path, getCoordinates) {
  var geos = through2.obj(function (obj, enc, next) {
    var geo = toGeoJSON(obj, getCoordinates);
    this.push(JSON.stringify(geo));
    next();
  });

  return readable.pipe(JSONStream.parse(path)).pipe(geos);
}

/**
 * Get a function that finds the coordinates of an object
 *
 * @param {string} lat e.g. 'location.lat'
 * @param {string} lng e.g. 'location.coordinates[1]'
 * @return {function} accessor to get coordinates from an object
 */
function buildAccessor(lng, lat) {
  return (obj) => [ prop(lng)(obj), prop(lat)(obj) ];
}
