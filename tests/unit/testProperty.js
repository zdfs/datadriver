var test = require('tape');
var rewire = require('rewire');
var drive = rewire('../../lib/datadriver');

test('The testProperty() function', function(t) {

	var testProperty = drive.__get__('testProperty');

	t.equal(testProperty.apply(null, [
			{ data: { value: 'test1' }, assert: 'test1', mode: [ 'equal' ] },
			{ data: { value: 'test1' }, assert: 'test2', mode: [ 'equal' ] }
		]).__flags.object, 'test1', 'Only test the first object of an array.');

	try {
		testProperty.apply(null, [
			{ data: { value: 1 }, assert: 0, mode: [ 'be', 'below' ] }
		]);
	} catch (e) {
		t.equal(e.message, 'expected 1 to be below 0', 'Multiple assertion modes: be below')
	}

	try {
		testProperty.apply(null, [
			{ data: { value: 0 }, assert: 1, mode: [ 'be', 'above' ] }
		]);
	} catch (e) {
		t.equal(e.message, 'expected 0 to be above 1', 'Multiple assertion modes: be above')
	}

	try {
		testProperty.apply(null, [
			{ data: { value: 1 }, assert: 1, mode: [ 'not', 'equal' ] }
		]);
	} catch (e) {
		t.equal(e.message, 'expected 1 to not equal 1', 'Multiple assertion modes: not equal')
	}

	try {
		testProperty.apply(null, [
			{ data: { value: 1 }, assert: 1, mode: [ 'not', 'eql' ] }
		]);
	} catch (e) {
		t.equal(e.message, 'expected 1 to not deeply equal 1', 'Multiple assertion modes: not deeply equal')
	}

	try {
		testProperty.apply(null, [
			{ data: { value: true }, assert: false, mode: [ 'to', 'not', 'be', 'ok' ] }
		]);
	} catch (e) {
		t.equal(e.message, 'expected true to be falsy', 'Multiple assertion modes: to not be ok')
	}

	try {
		testProperty.apply(null, [
			{ data: { value: 1 }, assert: 0, mode: [ 'be', 'at', 'most' ] }
		]);
	} catch (e) {
		t.equal(e.message, 'expected 1 to be at most 0', 'Multiple assertion modes: be at most')
	}

	t.end();

});