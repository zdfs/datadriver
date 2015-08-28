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
 * Keep track of how many times testProperty() is called.
 */

var methodsCalled = {
	setViewportSize: 0,
	describe: 0,
	before: 0,
	url: 0,
	verify: 0
};

var describeText;

/**
 * Set up the mocked variables and functions.
 */

drive.__set__({
	browser: {
		addCommand: function(title, fn) {
			return browser[title] = fn;
		},
		call: function(done) {},
		desiredCapabilities: {
			browserName: 'firefox',
			viewports: {
				large: true
			}
		},
		setViewportSize: function() {
			methodsCalled.setViewportSize++;
		},
		url: function() {
			methodsCalled.url++;
		}
	},
	it: function(title, fn) {
		fn();
	},
	describe: function(title, fn) {
		describeText = title;
		methodsCalled.describe++;
		fn();
	},
	before: function() {
		methodsCalled.before++;
	},
	'drive.verify': function() {
		methodsCalled.verify++;
	}
});

/**
 * Run our tests.
 */

test('The go() method', function(t) {

	try {
		drive.go({
			config: {}
		});
	} catch(e) {
		t.throws(e, 'An empty configuration description throws an error.');
	}

	try {
		drive.go({
			config: {
				description: 'test'
			}
		});
	} catch(e) {
		t.throws(e, 'An empty suites array throws an error.');
	}

	try {
		drive.go({
			config: {
				description: 'test',
				suites: {}
			}
		});
	} catch(e) {
		t.throws(e, 'Suites array can\'t be an object.');
	}

	try {
		drive.go({
			config: {
				description: 'test describe',
				suites: ['test']
			}
		});
	} catch(e) {
	 	t.equals(methodsCalled.describe, 1, 'The describe() method was called.');
		t.equals(describeText, 'test describe', 'The describe() method has the right title.');
		t.equals(methodsCalled.before, 1, 'The before() method was called.');
		t.throws(e, 'The suite is missing a description');
	}

	try {
		drive.go({
			config: {
				description: 'test describe',
				suites: [
					{
						description: 'holla'
					}
				]
			}
		});
	} catch(e) {
		t.throws(e, 'Test suite is missing a "tests" array.');
	}

	try {
		drive.go({
			config: {
				description: 'test describe',
				suites: [
					{
						description: 'holla',
						tests: {}
					}
				]
			}
		});
	} catch(e) {
		t.throws(e, 'The "test" array can\'t be an object.');
	}

	try {
		drive.go({
			config: {
				description: 'test describe',
				suites: [
					{
						description: 'holla',
						tests: ["tests"]
					}
				]
			}
		});
	} catch(e) {
		t.throws(e, 'The suite is missing a viewports object.');
	}

	try {
		drive.go({
			config: {
				description: 'test describe',
				suites: [
					{
						description: 'holla',
						tests: ["tests"],
						viewports: { large: true }
					}
				]
			}
		});
	} catch(e) {
		t.throws(e, 'Can\'t find an object with a steps property.');
	}

	methodsCalled.describe = 0;
	methodsCalled.before = 0;


	drive.go({
		config: {
			description: 'test describe',
			suites: [
				{
					description: 'holla',
					tests: ["tests"],
					viewports: { large: true }
				}
			]
		},
		tests: {
			steps: []
		}
	});

	t.equals(methodsCalled.describe, 3, 'The describe() method was called three times.');
	t.equals(describeText, 'holla', 'The describe() method has the right title.');
	t.equals(methodsCalled.before, 2, 'The before() method was called twice.');
	t.equals(methodsCalled.verify, 1, 'The drive.verify() method was called.');

	t.end();

});