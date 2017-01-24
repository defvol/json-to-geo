var test = require('tape');
var utils = require('../lib/utils');

test('usage', function (t) {
  var got = utils.usage();
  t.true(got.match(/usage/), 'returns some instructions');
  t.true(got.length > 50, 'lots of instructions');
  t.end();
});

test('version', function (t) {
  var got = utils.version();
  t.true(got.match(/^\d+\.\d+\.\d+$/), 'finds basic semver in package.json');
  t.end();
});

test('array deepness', function (t) {
  t.equal(utils.deepness(42), 0, 'just a number');
  t.equal(utils.deepness([42]), 1, 'nested levels = 1');
  t.equal(utils.deepness([[42]]), 2, 'nested levels = 2');
  t.equal(utils.deepness([[[42]]]), 3, 'nested levels = 3');
  t.end();
});
