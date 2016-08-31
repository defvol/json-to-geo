module.exports = {
  findCoordinates: findCoordinates,
  toGeoJSON: toGeoJSON
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
