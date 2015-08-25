var test = require('tape');
var rewire = require('rewire');
var drive = rewire('../../lib/datadriver');
var verifyCalled = [];
var executeCalled = [];

var verifyStepMock = function(args) {
	verifyCalled.push(args);
};

var executeStepMock = function(args) {
	executeCalled.push(args);
};

var invalidData = {

	"not-a-step": [
		{
			"selector": ".dont-care",
			"verify": [
				{
					"method": "verifyCount",
					"asserts": {
						"count": 1
					}
				}
			]
		}
	]

};

var onlySelectorData = {

	"steps": [
		{
			"selector": ".dont-care"
		}
	]

};

var validData = {

	"steps": [
		{
			"selector": ".dont-care",
			"verify": [
				{
					"method": "verifyCount",
					"asserts": {
						"count": 1
					}
				},
				{
					"method": "verifyPageTitle",
					"asserts": {
						"title": "Watch me nay-nay."
					}
				}
			],
			"execute": [
				{ "action": "click" },
				{ "action": "pause", "time": 350 }
			]
		},
		{
			"selector": ".dont-care-either",
			"verify": [
				{
					"method": "verifyCount",
					"asserts": {
						"count": 1
					}
				},
				{
					"method": "verifyPageTitle",
					"asserts": {
						"title": "Watch me nay-nay."
					}
				}
			],
			"execute": [
				{ "action": "click" },
				{ "action": "pause", "time": 350 }
			]
		}
	]

};

test('The verify() function', function(t) {

	drive.__set__("drive.verifyStep", verifyStepMock);
	drive.__set__("drive.executeStep", executeStepMock);

	try {
		drive.verify.apply(null, [invalidData]);
	} catch (e) {
		t.throws(e, 'When there isn\'t a "steps" array, an error is thrown.');
	}

	drive.verify.apply(null, [onlySelectorData]);

	t.equal(verifyCalled.length + executeCalled.length, 0, 'Nothing happens when the step only has a selector key.');

	drive.verify.apply(null, [validData]);

	t.equal(verifyCalled.length, 2, 'The drive.verifyStep() method called twice.');
	t.equal(executeCalled.length, 2, 'The drive.executeStep() method was called twice.');
	t.equal(executeCalled[0].selector, '.dont-care', 'The drive.executeStep() is sent the right selector.');
	t.equal(executeCalled[0].execute.length, 2, 'The drive.executeStep() method gets two steps.');
	t.equal(executeCalled[0].execute[0].action, 'click', 'The first execute is a click action.');
	t.equal(executeCalled[0].execute[1].action, 'pause', 'The second execute is a pause action.');
	t.equal(executeCalled[0].execute[1].time, 350, 'The second execute has a pause time of 350 milliseconds.');
	t.equal(verifyCalled[0].selector, '.dont-care', 'The drive.verifyStep() method is sent the right selector.');
	t.equal(verifyCalled[0].verify.length, 2, 'The drive.verifyStep() method gets two steps.');
	t.equal(verifyCalled[0].verify[0].method, 'verifyCount', 'The first verify method is verifyCount()');
	t.equal(verifyCalled[0].verify[1].method, 'verifyPageTitle', 'The second verify method is verifyPageTitle()');

	t.end();

});