var test = require('tape');
var rewire = require('rewire');
var drive = rewire('../../lib/datadriver');

test('The parseValue() function', function(t) {

	var parseValue = drive.__get__('parseValue');

	t.equal(parseValue.apply(null, ['rgba(0,0,0,1)', 'rgba(0,0,0,1)']), 'rgba(0,0,0,1)', 'Color values are parsed correctly');
	t.equal(parseValue.apply(null, ['test', 'test']), 'test', 'Strings are parsed correctly.');
	t.equal(parseValue.apply(null, [5,5]), 5, 'Integers are parsed correctly');
	t.equal(parseValue.apply(null, ['3px', 3]), 3, 'Pixel values are parsed correctly');
	t.equal(parseValue.apply(null, ['inline-block', 'inline-block']), 'inline-block', 'CSS properties with dashes are parsed correctly.');
	t.equal(parseValue.apply(null, [true, true]), true, 'Truthy boolean values are parsed correctly.');
	t.equal(parseValue.apply(null, [false, false]), false, 'Falsy boolean values are parsed correctly.');
	t.equal(parseValue.apply(null, ['314.203124px', 314]), 314, 'Float pixel values are parsed correctly.');
	t.equal(parseValue.apply(null, [314.203124, 314]), 314, 'Float values are parsed correctly.');
	t.equal(parseValue.apply(null, ['http://datadriver.io', 'http://datadriver.io']), 'http://datadriver.io', 'URLs are parsed correctly.');
	t.equal(parseValue.apply(null, ['true', true]), true, 'Truthy string booleans are parsed in to real booleans.');
	t.equal(parseValue.apply(null, ['false', false]), false, 'Falsy string booleans are parsed in to real booleans.');

	t.end();

});