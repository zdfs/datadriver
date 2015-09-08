/**
 * Import tape and rewire.
 */

var test = require('tape');
var rewire = require('rewire');

/**
 * Rewire the datadriver module.
 */

var drive = rewire('../../lib/datadriver');

/**
 * Set up our browser capabilities.
 */

drive.__set__({
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
 * Run our tests.
 */

test('The setup() method', function(t) {

	var setup = drive.setup();

	t.notEqual(browser, undefined, 'The global browser object should be defined.');
	t.notEqual(browser.executeAndStore, undefined, 'The browser object should have an executeAndStore() method.');
	t.notEqual(setup.chai, undefined, 'The Chai assertion object should be defined.');
	t.notEqual(setup.chai.should, undefined, 'The should() interface for Chai should be defined.');

	t.end();

});