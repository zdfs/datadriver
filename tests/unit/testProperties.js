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
 * More variables we're going to need.
 */

var invalidAssertObject;
var validAssertObject;
var validAssertObjectWithOverride;
var validAssertArray;
var validAssertArrayWithOverrides;

/**
 * Set up our browser capabilities and it function for asserts.
 */

drive.__set__({
	it: function(title, fn) {},
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
 * Mock data for an invalid assert object.
 */

invalidAssertObject = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	selector: '.grid--third',
	method: 'verifyCount',
	assert: { count: 2 },
	mode: [ 'be', 'above' ],
	actions: undefined
};

/**
 * Mock data for a valid assert object.
 */

validAssertObject = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	selector: '.grid--third',
	method: 'verifyCount',
	asserts: { count: 2 },
	mode: [ 'be', 'above' ],
	actions: undefined
};

/**
 * Mock data for a valid assert object with browser-specific overrides.
 */

validAssertObjectWithOverride = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	selector: '.grid--third',
	method: 'verifyCount',
	asserts: { count: 2 },
	"asserts-firefox": { count: 3 },
	mode: [ 'be', 'above' ],
	actions: undefined
};

/**
 * Mock data for a valid assert array.
 */

validAssertArray = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	selector: '.grid--third',
	method: 'verifyCount',
	asserts: [ { count: 2 }, { count: 3 } ],
	mode: [ 'be', 'above' ],
	actions: undefined
};

/**
 * Mock data for a valid assert array with browser-specific overrides.
 */

validAssertArrayWithOverrides = {
	step: {
		selector: '.grid--third',
		verify: [{}]
	},
	selector: '.grid--third',
	method: 'verifyCount',
	asserts: [ { count: 2 }, { count: 3 } ],
	"asserts-firefox": [ { count: 4 }, { count: 5 } ],
	mode: [ 'be', 'above' ],
	actions: undefined
};

/**
 * Run our tests.
 */

test('The testProperties() function', function(t) {

	drive.setup();

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