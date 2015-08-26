/**
 * Import tape and rewire.
 */

var test = require('tape');
var rewire = require('rewire');

/**
 * Rewire our datadriver module.
 */

var drive = rewire('../../lib/datadriver');

/**
 * Run our tests.
 */

test('The getChaiAsserts() function', function(t) {

	var getChaiAsserts = drive.__get__('getChaiAsserts');

	t.equal(getChaiAsserts.apply(null, [undefined, undefined])[0], 'equal', 'An undefined default assert mode and undefined ' +
		'override assert mode returns the correct default assert mode.');

	t.equal(getChaiAsserts.apply(null, [undefined, 'contains'])[0], 'contains', 'A default assert mode of "contains" and an ' +
		'undefined override assert mode returns the correct default assert mode.');

	t.equal(getChaiAsserts.apply(null, ['to be above', 'contains']).length, 3, 'An defined override assert mode overrides a ' +
		'default assert mode of "contains".');

	t.end();

});