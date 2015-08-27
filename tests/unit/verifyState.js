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
	isExisting: 0,
	isVisible: 0,
	isEnabled: 0,
	isSelected: 0,
	testProperty: 0
};

/**
 * A variable for keeping track of our test descriptions.
 */

var textResult;

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
		isExisting: function(selector, fn) {
			methodsCalled.isExisting++;
			fn.apply(null, [undefined, true]);
		},
		isVisible: function(selector, fn) {
			methodsCalled.isVisible++;
			fn.apply(null, [undefined, false]);
		},
		isEnabled: function(selector, fn) {
			methodsCalled.isEnabled++;
			fn.apply(null, [undefined, true]);
		},
		isSelected: function(selector, fn) {
			methodsCalled.isSelected++;
			fn.apply(null, [undefined, true]);
		}
	},
	it: function(title, fn) {
		fn();
		textResult = title;
	},
	testProperty: function() {
		methodsCalled.testProperty++;
	}
});

/**
 * Run our tests.
 */

test('The verifyState() method', function(t) {

	var isExistingTest;
	var isVisibleTest;
	var isEnabledTest;
	var isSelectedTest;
	var result;

	isExistingTest = {
		selector: '#button1',
		assertKey: 'isExisting',
		assert: true,
		mode: ['equal']
	};

	isVisibleTest = {
		selector: '#button1',
		assertKey: 'isVisible',
		assert: false,
		mode: ['equal']
	};

	isEnabledTest = {
		selector: '#button1',
		assertKey: 'isEnabled',
		assert: true,
		mode: ['equal']
	};

	isSelectedTest = {
		selector: '#button1',
		assertKey: 'isSelected',
		assert: true,
		mode: ['equal']
	};

	result = drive.verifyState(isExistingTest)[0];

	t.equals(textResult, 'the "#button1" element exists on the page');
	t.equals(result.data, true, 'The assert data comes back as true');
	t.equals(result.assert, true, 'The assert value is true');
	t.equals(result.mode[0], 'equal', 'The assert mode is equal.');
	t.equals(methodsCalled.isExisting, 1, 'The browser.isExisting() method was called.');
	t.equals(methodsCalled.testProperty, 1, 'The private testProperty() function was called.');

	result = drive.verifyState(isVisibleTest)[0];

	t.equals(textResult, 'the "#button1" element is not visible on the page');
	t.equals(result.data, false, 'The assert data comes back as false');
	t.equals(result.assert, false, 'The assert value is false');
	t.equals(result.mode[0], 'equal', 'The assert mode is equal.');
	t.equals(methodsCalled.isVisible, 1, 'The browser.isVisible() method was called.');
	t.equals(methodsCalled.testProperty, 2, 'The private testProperty() function was called.');

	result = drive.verifyState(isEnabledTest)[0];

	t.equals(textResult, 'the "#button1" element is enabled on the page');
	t.equals(result.data, true, 'The assert data comes back as true');
	t.equals(result.assert, true, 'The assert value is true');
	t.equals(result.mode[0], 'equal', 'The assert mode is equal.');
	t.equals(methodsCalled.isEnabled, 1, 'The browser.isEnabled() method was called.');
	t.equals(methodsCalled.testProperty, 3, 'The private testProperty() function was called.');

	result = drive.verifyState(isSelectedTest)[0];

	t.equals(textResult, 'the "#button1" element is selected on the page');
	t.equals(result.data, true, 'The assert data comes back as true');
	t.equals(result.assert, true, 'The assert value is true');
	t.equals(result.mode[0], 'equal', 'The assert mode is equal.');
	t.equals(methodsCalled.isSelected, 1, 'The browser.isSelected() method was called.');
	t.equals(methodsCalled.testProperty, 4, 'The private testProperty() function was called.');

	t.end();

});