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
	getAttribute: 0
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
		getAttribute: function(selector, assertKey, fn) {

			methodsCalled.getAttribute++;

			if (assertKey === 'class') {
				fn.apply(null, [undefined, "test"]);
			} else {
				fn.apply(null, [undefined, null]);
			}

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

test('The verifyGetAttribute() method', function(t) {

	var normalAttrTest;
	var booleanAttrTest;
	var result;

	normalAttrTest = {
		selector: '#button1',
		assertKey: 'class',
		assert: 'test',
		mode: ['equal']
	};

	booleanAttrTest = {
		selector: '#button1',
		assertKey: 'data-wtf',
		assert: null,
		mode: ['equal']
	};

	result = drive.verifyAttribute(normalAttrTest)[0];

	t.equals(result.data, 'test', 'The data is passed to the test');
	t.equals(result.assert, 'test', 'The assert is passed to the test');
	t.equals(result.mode[0], 'equal', 'The assert mode is passed to the test');
	t.equals(methodsCalled.testProperty, 1, 'The testProperty method was called.');
	t.equals(methodsCalled.getAttribute, 1, 'The browser.getAttribute() method was called.');

	result = drive.verifyAttribute(booleanAttrTest)[0];

	t.equals(result.data, null, 'The null data is passed to the test');
	t.equals(result.assert, null, 'The null assert is passed to the test');
	t.equals(result.mode[0], 'equal', 'The assert mode is passed to the test');
	t.equals(methodsCalled.testProperty, 1, 'The testProperty method was not called.');
	t.equals(methodsCalled.getAttribute, 2, 'The browser.getCssProperty() method was called.');

	t.end();

});