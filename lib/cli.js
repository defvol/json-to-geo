#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var jgeo = require('./index');
var util = require('./utils');

if (argv.version || argv.v) {
  console.log(util.version());
} else if (argv.help || argv.h) {
  console.log(util.usage());
} else {
  var path = argv.path || '*';
  var getCoordinates = null;
  if (argv.lng && argv.lat)
    getCoordinates = jgeo.buildAccessor(argv.lng, argv.lat);

  jgeo.transform(process.stdin, path, getCoordinates).pipe(process.stdout);
}
