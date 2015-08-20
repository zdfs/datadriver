var test = require('tape');
var rewire = require('rewire');
var drive = rewire('../../lib/datadriver');

test('The buildChaiAssertString() function', function(t) {

	var buildChaiAssertString = drive.__get__('buildChaiAssertString');

	t.equal(buildChaiAssertString.apply(null, [['equal']]), 'should equal', 'A mode of ["equal"] returns "should equal"');
	t.equal(buildChaiAssertString.apply(null, [['be', 'at', 'least']]), 'should be at least', 'A mode of ["be", "at", "least"] returns "should be at least"');

	t.end();

});