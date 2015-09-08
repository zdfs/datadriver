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
 * Mock out our browser capabilities.
 */

drive.__set__({
	browser: {
		desiredCapabilities: {
			browserName: 'firefox'
		}
	}
});

/**
 * Run our tests.
 */

test('The getBrowserName() function', function(t) {

	var getBrowserName = drive.__get__('getBrowserName');

	t.equal(getBrowserName.apply(null, []), 'firefox', 'The browser name is returned as firefox.');

	t.end();

});