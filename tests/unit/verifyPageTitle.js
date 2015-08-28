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
	title: 0
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
		title: function(fn) {
			methodsCalled.title++;
			fn.apply(null, [undefined, 'page title']);
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

test('The verifyPageTitle() method', function(t) {

	var test;
	var result;

	test = {
		selector: 'window',
		assertKey: 'title',
		assert: 'page title',
		mode: ['equal']
	};

	result = drive.verifyPageTitle(test)[0];

	t.equals(result.data, 'page title', 'The data is passed to the test');
	t.equals(result.assert, 'page title', 'The assert is passed to the test');
	t.equals(result.mode[0], 'equal', 'The assert mode is passed to the test');
	t.equals(methodsCalled.testProperty, 1, 'The testProperty method was called.');
	t.equals(methodsCalled.title, 1, 'The browser.title() method was called.');

	t.end();

});