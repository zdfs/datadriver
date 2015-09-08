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
	getText: 0
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
		getText: function(selector, fn) {
			methodsCalled.getText++;
			fn.apply(null, [undefined, 'this is the text']);
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

test('The verifyText() method', function(t) {

	var test;
	var result;

	test = {
		selector: '#button1',
		assertKey: 'text',
		assert: 'this is the text',
		mode: ['equal']
	};

	result = drive.verifyText(test)[0];

	t.equals(result.data, 'this is the text', 'The data is passed to the test');
	t.equals(result.assert, 'this is the text', 'The assert is passed to the test');
	t.equals(result.mode[0], 'equal', 'The assert mode is passed to the test');
	t.equals(methodsCalled.testProperty, 1, 'The testProperty method was called.');
	t.equals(methodsCalled.getText, 1, 'The browser.getText() method was called.');

	t.end();

});