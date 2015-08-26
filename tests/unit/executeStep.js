/**
 * Require tape and rewire.
 */

var test = require('tape');
var rewire = require('rewire');

/**
 * Rewire the datadriver module
 */

var drive = rewire('../../lib/datadriver');

/**
 * An array for keeping track of the actions we call.
 * @type {Array}
 */

var executeCalled = [];

/**
 * A mock function that just pushes the return value
 * to our executeCalled array for testing.
 * @param args
 */

var executeMock = function(args) {
	executeCalled.push(args);
};

/**
 * Our mock data for the executeStep function.
 */

var actionSet = {
	selector: '.some-element',
	execute: [
		{
			action: 'pause',
			time: 350
		},
		{
			action: 'click'
		}
	]
};

/**
 * Run our test.
 */

test('The executeStep() function', function(t) {

	var result;

	drive.__set__("drive.execute", executeMock);

	result = drive.executeStep.apply(null, [actionSet]);

	t.equal(executeCalled.length, 2, 'The drive.execute() method was called twice.');
	t.equal(result[0].selector, '.some-element', 'The first action selector is correct.');
	t.equal(result[0].execute.action, 'pause', 'The first action is a pause');
	t.equal(result[0].execute.time, 350, 'The pause action has a time argument of 350 milliseconds.');
	t.equal(result[1].execute.action, 'click', 'The second action is a click.');

	t.end();

});