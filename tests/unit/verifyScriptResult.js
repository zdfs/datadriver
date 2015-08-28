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

var methodsCalled = {
	testProperty: 0,
	execute: 0
};

/**
 * Set up the mocked variables and functions.
 */

drive.__set__({
	browser: {
		addCommand: function(title, fn) {
			return browser[title] = fn;
		},
		call: function(done) {},
		desiredCapabilities: { browserName: 'firefox' },
		execute: function(selector, fn) {
			methodsCalled.execute++;
			fn.apply(null, [undefined, { value: true } ]);
		}
	},
	it: function(title, fn) {
		fn();
	},
	testProperty: function() {
		methodsCalled.testProperty++;
	}
});

/**
 * Run our tests.
 */

test('The verifyScriptResult() method', function(t) {

	var test;
	var result;

	test = {
		selector: 'return 3 > 2;',
		assertKey: 'result',
		assert: true,
		mode: ['equal']
	};

	result = drive.verifyScriptResult(test)[0];

	t.equals(result.data, true, 'The data is passed to the test');
	t.equals(result.assert, true, 'The assert is passed to the test');
	t.equals(result.mode[0], 'equal', 'The assert mode is passed to the test');
	t.equals(methodsCalled.testProperty, 1, 'The testProperty method was called.');
	t.equals(methodsCalled.execute, 1, 'The browser.elements() method was called.');

	t.end();

});