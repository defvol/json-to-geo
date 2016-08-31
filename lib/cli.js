#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var pack = require('./index');
var util = require('./utils');

if (argv.version || argv.v) {
  console.log(util.version());
} else if (argv.help || argv.h) {
  console.log(util.usage());
} else {
  console.log(pack());
}
