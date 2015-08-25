var test = require('tape');
var rewire = require('rewire');
var drive = rewire('../../lib/datadriver');
var executeCalled = [];
var executeMock = function(args) {
	executeCalled.push(args);
};

var actionSet = {
	"selector": ".some-element",
	"execute": [
		{
			"action": "pause",
			"time": 350
		},
		{
			"action": "click"
		}
	]
};

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