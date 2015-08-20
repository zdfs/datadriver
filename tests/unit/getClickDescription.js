var test = require('tape');
var rewire = require('rewire');
var drive = rewire('../../lib/datadriver');

test('The getClickDescription() function', function(t) {

	var getClickDescription = drive.__get__('getClickDescription');

	t.equal(getClickDescription.apply(null, [0]), 'left', '0 is identified as the left button');
	t.equal(getClickDescription.apply(null, [1]), 'middle', '1 is identified as the middle button');
	t.equal(getClickDescription.apply(null, [2]), 'right', '2 is identified as the right button');

	t.end();

});