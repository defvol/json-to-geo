var fs = require('fs');

/**
 * Get usage instructions
 * @return {String} the instructions to run this thing
 */
module.exports.usage = function () {
  var u = [];
  u.push('Convert JSON objects into GeoJSON features');
  u.push('usage: json-to-geo [options]');
  u.push('');
  u.push(' --path to array of features, e.g. "response.venues.*"');
  u.push(' --lng to find the longitude property, e.g. "location.lng"');
  u.push(' --lat to find the latitude property, e.g. "location.lat"');
  u.push(' --help prints this message');
  u.push(' --version prints package version');
  u.push('');
  return u.join('\n');
};

/**
 * Get module version from the package.json file
 * @return {String} version number
 */
module.exports.version = function () {
  var data = fs.readFileSync(__dirname + '/../package.json');
  return JSON.parse(data).version;
};
