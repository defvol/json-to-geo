var JSONStream = require('jsonstream');
var prop = require('lodash.property');
var split2 = require('split2');
var through2 = require('through2');
var utils = require('./utils');

module.exports = {
  buildAccessor: buildAccessor,
  findCoordinates: findCoordinates,
  inferGeometryType: inferGeometryType,
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
 * Best effort to find the feature's type based on the coordinates array
 *
 * @param {Array} coords - feature's coordinates
 * @return {String} featureType - either Point, LineString, or Polygon
 */
function inferGeometryType(coords) {
  switch (utils.deepness(coords)) {
    case 1:
      return 'Point';
    case 2:
      return 'LineString';
    case 3:
      return 'Polygon';
    default:
      return null;
  }
}

/**
 * Transform a stream of objects into line-delimited GeoJSON features
 *
 * @param {object} params with the following options:
 * - {stream} readable
 * - {string} path to array of objects to transform
 * - {function} getCoordinates
 * - {boolean} isLineDelimited whether input is line-delimited
 * @return {stream} transform stream
 */
function transform(params) {
  var geos = through2.obj(function (obj, enc, next) {
    var geo = toGeoJSON(obj, params.getCoordinates);
    this.push(JSON.stringify(geo) + '\n');
    next();
  });

  var ndj = params.isLineDelimited;
  var objParser = ndj ? split2(JSON.parse) : JSONStream.parse(params.path);

  return params.readable.pipe(objParser).pipe(geos);
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
