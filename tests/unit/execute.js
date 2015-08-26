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
 * Some other variables we're going to need for our tests.
 */

var methodsCalled;

/**
 * Initialize our methodsCalled mock.
 */

methodsCalled = {
	url: 0
};

/**
 * Add all the objects our module is expecting to have.
 */

drive.__set__({
	browser: {
		addCommand: function(title, fn) {
			return browser[title] = fn;
		},
		call: function(done) {},
		desiredCapabilities: {
			browserName: "firefox"
		},
		url: function() {
			methodsCalled.url++;
		}
	},
	it: function(title, fn) {
		fn();
	}
});

test('Execute a redirect action', function(t) {

	var result;
	var redirectAction1;
	var redirectAction2;
	var redirectAction3;
	var redirectAction4;

	redirectAction1 = {
		execute: {
			action: 'redirect',
			page: 'api/execute/buttonDown.html'
		}
	};

	redirectAction2 = {
		execute: {
			action: 'redirect',
			page: 'http://www.google.com'
		}
	};

	redirectAction3 = {
		execute: {
			action: 'url',
			page: 'api/execute/buttonDown.html'
		}
	};

	result = drive.execute(redirectAction1);

	t.equal(result.method, 'url', 'The browser method is url()');
	t.equal(result.args[0], drive.getBaseUrl() + 'api/execute/buttonDown.html', 'The arguments for browser.url() are correct.');
	t.equal(result.description, 'redirecting to "' + drive.getBaseUrl() + 'api/execute/buttonDown.html"', 'The test description is correct.');
	t.equal(methodsCalled.url, 1, 'The browser.url() method was called.');

	result = drive.execute(redirectAction2);

	t.equal(result.method, 'url', 'The browser method is url()');
	t.equal(result.args[0], 'http://www.google.com', 'The arguments for browser.url() are correct.');
	t.equal(result.description, 'redirecting to "http://www.google.com"', 'The test description is correct.');
	t.equal(methodsCalled.url, 2, 'The browser.url() method was called.');

	drive.execute(redirectAction3);

	t.equal(methodsCalled.url, 3, 'The browser.url() method was called with action: "url".');

	t.end();

});
