var test = require('tape');
var drive = require('../../lib/datadriver');

test('The setup() method', function(t) {

	var setup = drive.setup();

	t.notEqual(browser, undefined, 'The global browser object should be defined.');
	t.notEqual(browser.executeAndStore, undefined, 'The browser object should have an executeAndStore() method.');
	t.notEqual(setup.chai, undefined, 'The Chai assertion object should be defined.');
	t.notEqual(setup.chai.should, undefined, 'The should() interface for Chai should be defined.');

	t.end();

});