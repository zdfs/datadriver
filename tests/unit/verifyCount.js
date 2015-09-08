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
	elements: 0
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
		elements: function(selector, fn) {
			methodsCalled.elements++;
			fn.apply(null, [undefined, { value: ['.element1', '.element2'] } ]);
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

test('The verifyCount() method', function(t) {

	var test;
	var result;

	test = {
		selector: '.button',
		assertKey: 'count',
		assert: 2,
		mode: ['equal']
	};

	result = drive.verifyCount(test)[0];

	t.equals(result.data, 2, 'The data is passed to the test');
	t.equals(result.assert, 2, 'The assert is passed to the test');
	t.equals(result.mode[0], 'equal', 'The assert mode is passed to the test');
	t.equals(methodsCalled.testProperty, 1, 'The testProperty method was called.');
	t.equals(methodsCalled.elements, 1, 'The browser.elements() method was called.');

	t.end();

});