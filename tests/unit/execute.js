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
	url: 0,
	setValue: 0,
	refresh: 0,
	pause: 0,
	moveToObject: 0,
	click: 0
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
		},
		setValue: function() {
			methodsCalled.setValue++;
		},
		refresh: function() {
			methodsCalled.refresh++;
		},
		pause: function() {
			methodsCalled.pause++;
		},
		moveToObject: function() {
			methodsCalled.moveToObject++;
		},
		click: function() {
			methodsCalled.click++;
		}
	},
	it: function(title, fn) {
		fn();
	}
});

/**
 * Tests for the redirect or url action.
 */

test('Execute a redirect or url action', function(t) {

	var result;
	var redirectAction1;
	var redirectAction2;
	var redirectAction3;

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

/**
 * Tests for the type or setValue action.
 */

test('Execute a type or setValue action', function(t) {

	var result;
	var typeAction;
	var setValueAction;

	typeAction = {
		selector: '.some-selector',
		execute: {
			action: 'type',
			text: 'Tape and rewire are awesome.'
		}
	};

	setValueAction = {
		selector: '.some-selector',
		execute: {
			action: 'setValue',
			text: 'Tape and rewire are awesome.'
		}
	};

	result = drive.execute(typeAction);

	t.equal(result.method, 'setValue', 'The browser method is setValue()');
	t.equal(result.args[0], '.some-selector', 'The execute method is passed the right selector.');
	t.equal(result.args[1], 'Tape and rewire are awesome.', 'The execute method gets the text argument.');
	t.equal(result.description, 'executing "setValue" on ".some-selector".', 'The test description is correct.');
	t.equal(methodsCalled.setValue, 1, 'The browser.setValue() method was called.');

	drive.execute(setValueAction);

	t.equal(methodsCalled.setValue, 2, 'The browser.setValue() method was called with action: "setValue".');

	t.end();

});

/**
 * Tests for the refresh action.
 */

test('Execute a refresh action', function(t) {

	var result;
	var refreshAction;

	refreshAction = {
		execute: {
			action: 'refresh'
		}
	};

	result = drive.execute(refreshAction);

	t.equal(result.method, 'refresh', 'The browser method is refresh()');
	t.equal(result.args.length, 0, 'The refresh method doesn\'t take any arguments.');
	t.equal(result.description, 'executing a browser refresh on the current page', 'The test description is correct.');
	t.equal(methodsCalled.refresh, 1, 'The browser.refresh() method was called.');

	t.end();

});

/**
 * Tests for the pause action.
 */

test('Execute a pause action', function(t) {

	var result;
	var pauseAction;
	var pauseActionWithSelector;

	pauseAction = {
		execute: {
			action: 'pause',
			time: 350
		}
	};

	pauseActionWithSelector = {
		selector: '.so-what',
		execute: {
			action: 'pause',
			time: 350
		}
	};

	result = drive.execute(pauseAction);

	t.equal(result.method, 'pause', 'The browser method is pause()');
	t.equal(result.args[0], 350, 'The time argument is passed to the test.');
	t.equal(result.description, 'pausing on "window" for 350 milliseconds.', 'The test description is correct.');
	t.equal(methodsCalled.pause, 1, 'The browser.pause() method was called.');

	result = drive.execute(pauseActionWithSelector);

	t.equal(result.description, 'pausing on ".so-what" for 350 milliseconds.', 'The test description includes the selector.');
	t.equal(methodsCalled.pause, 2, 'The browser.pause() method was called.');

	t.end();

});

/**
 * Tests for the hover or moveToObject action.
 */

test('Execute a hover or moveToObject action', function(t) {

	var result;
	var hoverAction;
	var moveToObjectAction;

	hoverAction = {
		selector: '.so-what',
		execute: {
			action: 'hover'
		}
	};

	moveToObjectAction = {
		selector: '.so-what',
		execute: {
			action: 'moveToObject'
		}
	};

	result = drive.execute(hoverAction);

	t.equal(result.method, 'moveToObject', 'The browser method is moveToObject()');
	t.equal(result.args[0], '.so-what', 'The selector is passed to the test.');
	t.equal(result.args[1], 5, 'Our x-offset is hard-coded to 5.');
	t.equal(result.args[2], 5, 'Our y-offset is hard-coded to 5.');
	t.equal(result.description, 'moving to the center of the ".so-what" element.', 'The test description is correct.');
	t.equal(methodsCalled.moveToObject, 1, 'The browser.moveToObject() method was called.');

	drive.execute(moveToObjectAction);

	t.equal(methodsCalled.moveToObject, 2, 'The browser.moveToObject() method was called.');

	t.end();

});

/**
 * Tests for the click action.
 */

test('Execute a click action', function(t) {

	var result;
	var clickAction;

	clickAction = {
		selector: '.so-what',
		execute: {
			action: 'click'
		}
	};

	result = drive.execute(clickAction);

	t.equal(result.method, 'click', 'The browser method is click()');
	t.equal(result.args[0], '.so-what', 'The test is passed the selector as an argument.');
	t.equal(result.description, 'clicking the ".so-what" element.', 'The test description is correct.');
	t.equal(methodsCalled.click, 1, 'The browser.click() method was called.');

	t.end();

});