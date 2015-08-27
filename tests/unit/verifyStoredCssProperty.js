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
 * Keep track of what methods are called.
 */

var methodsCalled = {
	testProperty: 0,
	execute: 0,
	getCssProperty: 0
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
		desiredCapabilities: { browserName: "firefox" },
		getCssProperty: function(selector, assertKey, fn) {
			methodsCalled.getCssProperty++;
			fn.apply(null, [undefined, { method: 'verifyStoredCssProperty' }]);
		},
		execute: function(arg1, arg2, fn) {
			methodsCalled.execute++;
			fn.apply(null, [undefined, { value: 'zzzzz' }]);
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

test('The verifyStoredCssProperty() method', function(t) {

	var test;
	var result;

	test = {
		selector: '#button1',
		assertKey: 'font-weight',
		assert: "boldKey",
		mode: ['equal']
	};

	result = drive.verifyStoredCssProperty(test);

	t.equals(result[0].data.method, 'verifyStoredCssProperty', 'The data is passed to the test');
	t.equals(result[0].assert, 'zzzzz', 'The assert is passed to the test');
	t.equals(result[0].mode[0], 'equal', 'The assert mode is passed to the test');
	t.equals(methodsCalled.testProperty, 1, 'The testProperty() method was called.');
	t.equals(methodsCalled.execute, 1, 'The browser.execute() method was called.');
	t.equals(methodsCalled.getCssProperty, 1, 'The browser.getCssProperty() method was called.');

	t.end();

});