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
 * Test vars that we'll need later.
 */

var called = [];
var executeMock;
var hoverData;
var moveData;
var clickData;

/**
 * Mock out the it function that we use in our asserts.
 */

drive.__set__({
	it: function(title, fn) {}
});

/**
 * Our executeMock just keeps track of what is called by
 * pushing the return data to our called[] array.
 * @param args
 */

executeMock = function(args) {
	called.push(args);
};

/**
 * Mock data for what a hover event looks like.
 */

hoverData = {
	selector: 'a[href*="api/methods/execute.html"]',
	method: 'verifyCssProperty',
	asserts: {
		color: 'rgba(213,72,90,1)'
	},
	mode: [ 'equal' ],
	actions: [
		{
			hover: {
				'assert-mode': 'contains',
				asserts: {
					color: 'rgba(170,39,56,1)'
				}
			}
		}
	]
};

/**
 * Mock data for what a move event looks like.
 */

moveData = {
	selector: 'a[href*="api/methods/execute.html"]',
	method: 'verifyCssProperty',
	asserts: {
		color: 'rgba(213,72,90,1)'
	},
	mode: [ 'equal' ],
	actions: [
		{
			move: {
				to: 'a[href*="some-other-element"]',
				method: 'verifyCount',
				'assert-mode': 'contains',
				asserts: {
					color: 'rgba(0,0,0,1)'
				}
			}
		}
	]
};

/**
 * Mock data for what a click event looks like.
 */

clickData = {
	selector: 'a[href*="api/methods/execute.html"]',
	method: 'verifyCssProperty',
	asserts: {
		color: 'rgba(213,72,90,1)'
	},
	mode: [ 'equal' ],
	actions: [
		{
			click: {
				on: 'a[href*="some-other-element"]',
				method: 'verifyCount',
				'assert-mode': 'contains',
				asserts: {
					color: 'rgba(0,0,0,1)'
				},
				off: 'a[href*="jibberish.html"]'
			}
		}
	]
};

/**
 * Run our tests.
 */

test('The fireEvents() function', function(t) {

	var fireEvents = drive.__get__('fireEvents');
	var result;

	drive.__set__("drive.execute", executeMock);

	result = fireEvents.apply(null, [hoverData])[0];

	t.equal(called[0].selector, 'a[href*="api/methods/execute.html"]', 'The first execute call has the right selector.');
	t.equal(called[0].execute.action, 'hover', 'The first execute call was hover.');
	t.equal(called[1].selector, 'a[href*="api/methods/execute.html"]', 'The second execute call has the right selector.');
	t.equal(called[1].execute.action, 'pause', 'The second execute call was pause.');
	t.equal(called[1].execute.time, 350, 'The second execute pause time is 350 milliseconds');

	called = [];

	t.equal(result.selector, 'a[href*="api/methods/execute.html"]', 'The hover test has the correct selector.');
	t.equal(result.method, 'verifyCssProperty', 'The hover test has the correct verification method.');
	t.equal(result.asserts.color, 'rgba(170,39,56,1)', 'The hover test has the correct asserts object.');
	t.equal(result.mode[0], 'contains', 'The hover test uses the override assert mode.');

	result = fireEvents.apply(null, [moveData])[0];

	t.equal(called[0].selector, 'a[href*="some-other-element"]', 'The first execute call has the right selector.');
	t.equal(called[0].execute.action, 'hover', 'The first execute call was hover.');
	t.equal(called[1].selector, 'a[href*="api/methods/execute.html"]', 'The second execute call has the right selector.');
	t.equal(called[1].execute.action, 'pause', 'The second execute call was pause.');
	t.equal(called[1].execute.time, 350, 'The second execute pause time is 350 milliseconds');

	called = [];

	t.equal(result.selector, 'a[href*="api/methods/execute.html"]', 'The move test asserts object applies to original selector, not the "to" selector.');
	t.equal(result.method, 'verifyCssProperty', 'The move test keeps the original verification method. No override verification method is supported.');
	t.equal(result.asserts.color, 'rgba(0,0,0,1)', 'The move test has uses the override asserts object for verifications.');
	t.equal(result.mode[0], 'contains', 'The move test uses the override assert mode.');

	result = fireEvents.apply(null, [clickData]);

	t.equal(called[0].selector, 'a[href*="some-other-element"]', 'The first execute call has the right selector.');
	t.equal(called[0].execute.action, 'click', 'The first execute call was click.');
	t.equal(called[1].selector, 'a[href*="some-other-element"]', 'The first execute call has the right selector.');
	t.equal(called[1].execute.action, 'pause', 'The second execute call was pause.');
	t.equal(called[1].execute.time, 150, 'The second execute pause time is 350 milliseconds');
	t.equal(result[0].selector, 'a[href*="api/methods/execute.html"]', 'The click on test uses the original selector for verification.');
	t.equal(result[0].method, 'verifyCssProperty', 'The click on test uses the original verification method.');
	t.equal(result[0].asserts.color, 'rgba(0,0,0,1)', 'The click on test uses the asserts override object for verifications.');
	t.equal(result[0].mode[0], 'contains', 'The click on test uses the override assert mode.');
	t.equal(called[2].selector, 'a[href*="jibberish.html"]', 'The first execute call has the right selector.');
	t.equal(called[2].execute.action, 'click', 'The first execute call was click.');
	t.equal(called[3].selector, 'a[href*="jibberish.html"]', 'The first execute call has the right selector.');
	t.equal(called[3].execute.action, 'pause', 'The second execute call was pause.');
	t.equal(called[3].execute.time, 150, 'The second execute pause time is 350 milliseconds');
	t.equal(result[1].selector, 'a[href*="api/methods/execute.html"]', 'The click off test uses the original selector for verification.');
	t.equal(result[1].method, 'verifyCssProperty', 'The click off test uses the original verification method.');
	t.equal(result[1].asserts.color, 'rgba(213,72,90,1)', 'The click off test uses the original asserts object for verifications.');
	t.equal(result[1].mode[0], 'equal', 'The click off test uses the original assert mode.');

	called = [];

	t.end();

});