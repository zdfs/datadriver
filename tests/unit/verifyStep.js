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
 * Other variables our tests are going to need.
 */

var testPropertiesCalled = [];
var fireEventsCalled = [];
var testPropertiesMock;
var fireEventsMock;
var dataSet1;
var dataSet2;
var dataSet3;

/**
 * Set the capabilities of our browser object.
 */

drive.__set__({
	browser: {
		addCommand: function(title, fn) {
			return browser[title] = fn;
		},
		desiredCapabilities: {
			browserName: "firefox"
		}
	}
});

/**
 * Call this function to make sure our browser object is
 * set up properly.
 */

drive.setup();

/**
 * Set up or mock functions that push return values to arrays
 * that we can use in our tests.
 */

testPropertiesMock = function(args) {
	testPropertiesCalled.push(args);
};

fireEventsMock = function(args) {
	fireEventsCalled.push(args);
};

/**
 * First mock data object.
 */

dataSet1 = {
	selector: '.grid--third',
	verify: [
		{
			method: 'verifyCount',
			'assert-mode': 'be above',
			asserts: {
				count: 2
			}
		}
	]
};

/**
 * Our second mock data object.
 */

dataSet2 = {
	selector: '#button1',
	verify: [
		{
			method: 'verifyCssProperty',
			asserts: {
				'font-weight': 'bold'
			},
			'asserts-firefox': {
				'font-weight': 700
			}
		}
	]
};

/**
 * Or third mock data object.
 */

dataSet3 = {
	selector: 'a[href*="api/methods/execute.html"]',
	verify: [
		{
			method: 'verifyCssProperty',
			asserts: {
				color: 'rgba(213,72,90,1)'
			},
			then: [
				{
					hover: {
						asserts: {
							color: 'rgba(170,39,56,1)'
						}
					}
				}
			]
		},
		{
			method: 'verifyCount',
			'assert-mode': 'be above',
			asserts: {
				count: 2
			}
		}
	]
};

/**
 * Run our tests.
 */

test('The verifyStep() function', function(t) {

	var result;

	drive.__set__("testProperties", testPropertiesMock);
	drive.__set__("fireEvents", fireEventsMock);

	result = drive.verifyStep.apply(null, [dataSet1])[0];

	t.equal(testPropertiesCalled.length, 1, 'The testProperties() function was called once.');
	t.equal(fireEventsCalled.length, 0, 'The fireEvents() function was not called.');
	t.equal(result.selector, '.grid--third', 'The test was sent the right selector.');
	t.equal(result.method, 'verifyCount', 'The test was sent the right verification method');
	t.equal(result.asserts.count, 2, 'The test was sent the right asserts object');
	t.equal(result.mode.join(' '), 'be above', 'The test was sent the right assertion mode.');
	t.equal(result.actions, undefined, 'The test has no action defined.');

	testPropertiesCalled = [];
	fireEventsCalled = [];

	result = drive.verifyStep.apply(null, [dataSet2])[0];

	t.equal(testPropertiesCalled.length, 1, 'The testProperties() function was called once.');
	t.equal(fireEventsCalled.length, 0, 'The fireEvents() function was not called.');
	t.equal(result['asserts-firefox']['font-weight'], 700, 'The test has a browser specific asserts object.');

	testPropertiesCalled = [];
	fireEventsCalled = [];

	result = drive.verifyStep.apply(null, [dataSet3])[0];

	t.equal(testPropertiesCalled.length, 2, 'The testProperties() function was called twice.');
	t.equal(fireEventsCalled.length, 1, 'The fireEvents() function was called once.');
	t.notEqual(result.actions, undefined, 'The test has actions defined.');

	t.end();

});