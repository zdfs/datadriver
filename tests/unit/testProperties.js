var test = require('tape');
var rewire = require('rewire');
var drive = rewire('../../lib/datadriver');

var invalidAssertObject = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	verifyIndex: 0,
	selector: '.grid--third',
	method: 'verifyCount',
	assert: { count: 2 },
	mode: [ 'be', 'above' ],
	actions: undefined
};

var validAssertObject = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	verifyIndex: 0,
	selector: '.grid--third',
	method: 'verifyCount',
	asserts: { count: 2 },
	mode: [ 'be', 'above' ],
	actions: undefined
};

var validAssertObjectWithOverride = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	verifyIndex: 0,
	selector: '.grid--third',
	method: 'verifyCount',
	asserts: { count: 2 },
	"asserts-firefox": { count: 3 },
	mode: [ 'be', 'above' ],
	actions: undefined
};

var validAssertArray = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	verifyIndex: 0,
	selector: '.grid--third',
	method: 'verifyCount',
	asserts: [ { count: 2 }, { count: 3 } ],
	mode: [ 'be', 'above' ],
	actions: undefined
};

var validAssertArrayWithOverrides = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	verifyIndex: 0,
	selector: '.grid--third',
	method: 'verifyCount',
	asserts: [ { count: 2 }, { count: 3 } ],
	"asserts-firefox": [ { count: 4 }, { count: 5 } ],
	mode: [ 'be', 'above' ],
	actions: undefined
};


test('The testProperties() function', function(t) {

	var testProperties = drive.__get__('testProperties'),
			result;

	try {
		testProperties.apply(null, [invalidAssertObject]);
	} catch (e) {
		t.throws(e, 'An error is thrown when the "asserts" object isn\'t present');
	}

	result = testProperties.apply(null, [validAssertObject])[0];

	t.equal(result.selector, '.grid--third', 'Assert object has a selector');
	t.equal(result.assertKey, 'count', 'Assert object has an assert key');
	t.equal(result.assert, 2, 'Assert object has an assert value.');
	t.equal(result.mode.length, 2, 'Assert object has assert modes.');

	result = testProperties.apply(null, [validAssertObjectWithOverride])[0];

	t.equal(result.assert, 3, 'Assert object has an override assert value.');

	result = testProperties.apply(null, [validAssertArray]);

	t.equal(result.length, 2, 'Asserts array produces two tests');
	t.equal(result[0].selector, '.grid--third', 'First assert object has a selector');
	t.equal(result[0].assertKey, 'count', 'First assert object has an assert key');
	t.equal(result[0].assert, 2, 'First assert object has an assert value.');
	t.equal(result[0].mode.length, 2, 'First assert object has assert modes.');
	t.equal(result[1].assert, 3, 'Second assert object has a different assert value.');

	result = testProperties.apply(null, [validAssertArrayWithOverrides]);

	t.equal(result.length, 2, 'Asserts array with browser overrides produces two tests');
	t.equal(result[0].assert, 4, 'First assert object has an overridden assert value.');
	t.equal(result[1].assert, 5, 'Second assert object has an overridden assert value.');

	t.end();

});