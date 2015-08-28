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
	url: 0
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
		url: function(fn) {
			methodsCalled.url++;
			fn.apply(null, [undefined, 'http://datadriver.io']);
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

test('The verifyUrl() method', function(t) {

	var test;
	var result;

	test = {
		selector: 'window',
		assertKey: 'url',
		assert: 'http://datadriver.io',
		mode: ['equal']
	};

	result = drive.verifyUrl(test)[0];

	t.equals(result.data, 'http://datadriver.io', 'The data is passed to the test');
	t.equals(result.assert, 'http://datadriver.io', 'The assert is passed to the test');
	t.equals(result.mode[0], 'equal', 'The assert mode is passed to the test');
	t.equals(methodsCalled.testProperty, 1, 'The testProperty method was called.');
	t.equals(methodsCalled.url, 1, 'The browser.url() method was called.');

	t.end();

});