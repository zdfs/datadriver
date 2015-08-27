/**
 * Import tape and rewire.
 */

var test = require('tape');
var rewire = require('rewire');

/**
 * Rewire the datadriver module.
 */

var drive = rewire('../../lib/datadriver');

/**
 * Keep track of how many times testProperty() is called.
 */

var called = 0;

/**
 * Set up the mocked variables and functions.
 */

drive.__set__({
	browser: {
		addCommand: function(title, fn) {
			return browser[title] = fn;
		},
		call: function(done) {},
		desiredCapabilities: { browserName: "firefox" },
		getCssProperty: function(selector, assertKey, fn) {
			fn.apply(null, [undefined, { method: 'called' }]);
		}
	},
	it: function(title, fn) {
		fn();
	},
	testProperty: function() {
		called++;
	}
});

/**
 * Run our tests.
 */

test('The verifyCssProperty() method', function(t) {

	var test;
	var result;

	test = {
		selector: '#button1',
		assertKey: 'font-weight',
		assert: 'bold',
		mode: ['equal']
	};

	result = drive.verifyCssProperty(test)[0];

	t.equals(result.data.method, 'called', 'The data is passed to the test');
	t.equals(result.assert, 'bold', 'The assert is passed to the test');
	t.equals(result.mode[0], 'equal', 'The assert mode is passed to the test');
	t.equals(called, 1, 'The testProperty method was called.');

	t.end();

});