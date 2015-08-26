/**
 * Import tape and rewire
 */

var test = require('tape');
var rewire = require('rewire');

/**
 * Rewire our datadrive module.
 */

var drive = rewire('../../lib/datadriver');

/**
 * Run our tests.
 */

test('The getChaiAssertString() function', function(t) {

	var getChaiAssertString = drive.__get__('getChaiAssertString');

	t.equal(getChaiAssertString.apply(null, [['equal']]), 'should equal', 'A mode of ["equal"] returns "should equal"');
	t.equal(getChaiAssertString.apply(null, [['be', 'at', 'least']]), 'should be at least', 'A mode of ["be", "at", "least"] returns "should be at least"');

	t.end();

});