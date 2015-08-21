var test = require('tape');
var rewire = require('rewire');
var drive = rewire('../../lib/datadriver');

test('The getBrowserName() function', function(t) {

	var getBrowserName = drive.__get__('getBrowserName');

	t.equal(getBrowserName.apply(null, []), 'firefox', 'The browser name is returned as firefox.');

	t.end();

});