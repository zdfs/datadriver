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
	click: 0,
	setViewportSize: 0,
	execute: 0,
	executeAndStore: 0,
	keys: 0,
	buttonDown: 0,
	buttonUp: 0,
	moveTo: 0,
	setCookie: 0,
	deleteCookie: 0
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
		},
		setViewportSize: function() {
			methodsCalled.setViewportSize++;
		},
		execute: function() {
			methodsCalled.execute++;
		},
		executeAndStore: function() {
			methodsCalled.executeAndStore++;
		},
		keys: function() {
			methodsCalled.keys++;
		},
		buttonDown: function() {
			methodsCalled.buttonDown++;
		},
		buttonUp: function() {
			methodsCalled.buttonUp++;
		},
		moveTo: function() {
			methodsCalled.moveTo++;
		},
		setCookie: function() {
			methodsCalled.setCookie++;
		},
		deleteCookie: function() {
			methodsCalled.deleteCookie++;
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

/**
 * Tests for a setViewportSize action.
 */

test('Execute a setViewportSize action', function(t) {

	var result;
	var setViewportSizeAction;

	setViewportSizeAction = {
		execute: {
			action: 'setViewportSize',
			height: 400,
			width: 350
		}
	};

	result = drive.execute(setViewportSizeAction);

	t.equal(result.method, 'setViewportSize', 'The browser method is setViewportSize()');
	t.equal(result.args[0].height, 400, 'The test is passed a argument object with a height of 400.');
	t.equal(result.args[0].width, 350, 'The test is passed a argument object with a width of 350.');
	t.equal(result.description, 'giving the viewport a height of "400" and a width of "350"', 'The test description should be correct.');
	t.equal(methodsCalled.setViewportSize, 1, 'the browser.setViewportSize() method was called.');

	t.end();

});

/**
 * Tests for an execute or eval action.
 */

test('Execute an eval or execute action', function(t) {

	var result;
	var evalAction;
	var executeAction;

	evalAction = {
		execute: {
			action: 'eval',
			script: 'return 2 + 2;'
		}
	};

	executeAction = {
		execute: {
			action: 'execute',
			script: 'return 2 + 2;'
		}
	};

	result = drive.execute(evalAction);

	t.equal(result.method, 'execute', 'The browser method is execute()');
	t.equal(result.args[0], 'return 2 + 2;', 'The script to be executed is passed as an argument.');
	t.equal(result.description, 'executing javascript: return 2 + 2;', 'The test description is correct.');
	t.equal(methodsCalled.execute, 1, 'The browser.execute() method was called.');

	drive.execute(executeAction);

	t.equal(methodsCalled.execute, 2, 'The browser.execute() method was called for an "execute" action.');

	t.end();

});

/**
 * Tests for an executeAndStore action.
 */

test('Execute an executeAndStore action', function(t) {

	var result;
	var evalAndStoreAction;
	var executeAndStoreAction;

	evalAndStoreAction = {
		execute: {
			action: 'evalAndStore',
			script: 'return 2 + 2;',
			resultKey: 'evalKey'
		}
	};

	executeAndStoreAction = {
		execute: {
			action: 'executeAndStore',
			script: 'return 2 + 2;',
			resultKey: 'executeKey'
		}
	};

	result = drive.execute(evalAndStoreAction);

	t.equal(result.method, 'executeAndStore', 'The browser method is executeAndStore()');
	t.equal(result.args[0], 'return 2 + 2;', 'The test gets a script argument.');
	t.equal(result.args[1], 'evalKey', 'The test gets a resultKey argument.');
	t.equal(result.description, 'executing javascript and storing the result in local storage.', 'The test description is correct.');
	t.equal(methodsCalled.executeAndStore, 1, 'The browser.executeAndStore() method was called.');

	drive.execute(executeAndStoreAction);

	t.equal(methodsCalled.executeAndStore, 2, 'The browser.executeAndStore() method was called with an "executeAndStore" action.');

	t.end();

});

/**
 * Tests for a keys or sendKeystroke action.
 */

test('Execute a keys or sendKeystroke action', function(t) {

	var result;
	var keysAction;
	var sendKeystrokeAction;

	sendKeystrokeAction = {
		execute: {
			action: 'sendKeystroke',
			keystrokes: 'Equals'
		}
	};

	keysAction = {
		execute: {
			action: 'keys',
			keystrokes: 'Semicolon'
		}
	};

	result = drive.execute(sendKeystrokeAction);

	t.equals(result.method, 'keys', 'The browser method is keys()');
	t.equals(result.args[0], 'Equals', 'The test gets the keystrokes argument.');
	t.equals(result.description, 'sending keystroke(s) Equals');
	t.equals(methodsCalled.keys, 1, 'The browser.keys() method was called.');

	drive.execute(keysAction);

	t.equals(methodsCalled.keys, 2, 'The browser.keys() method was called for the "keys" action.');

	t.end();

});

/**
 * Tests for the buttonDown action.
 */

test('Execute a buttonDown action', function(t) {

	var result;
	var buttonDownAction;

	buttonDownAction = {
		execute: {
			action: 'buttonDown',
			button: 0
		}
	};

	result = drive.execute(buttonDownAction);

	t.equals(result.method, 'buttonDown', 'The browser method is buttonDown()');
	t.equals(result.args[0], 0, 'The test is passed the left button.');
	t.equals(result.description, 'pushing the left click down', 'The test description is correct.');
	t.equals(methodsCalled.buttonDown, 1, 'The browser.buttonDown() method was called.');

	t.end();

});

/**
 * Tests for the buttonUp action.
 */

test('Execute a buttonUp action', function(t) {

	var result;
	var buttonUpAction;

	buttonUpAction = {
		execute: {
			action: 'buttonUp',
			button: 2
		}
	};

	result = drive.execute(buttonUpAction);

	t.equals(result.method, 'buttonUp', 'The browser method is buttonUp()');
	t.equals(result.args[0], 2, 'The test is passed the right button.');
	t.equals(result.description, 'releasing the right click', 'The test description is correct.');
	t.equals(methodsCalled.buttonUp, 1, 'The browser.buttonUp() method was called.');

	t.end();

});

/**
 * Tests for the moveTo action.
 */

test('Execute a moveTo action', function(t) {

	var result;
	var moveToAction;

	moveToAction = {
		selector: '.so-what',
		execute: {
			action: 'moveTo',
			x: 10,
			y: 15
		}
	};

	result = drive.execute(moveToAction);

	t.equals(result.method, 'moveTo', 'The browser method is moveTo()');
	t.equals(result.args[0], null, 'The first argument is set to null');
	t.equals(result.args[1], 10, 'The second argument is x set to 10');
	t.equals(result.args[2], 15, 'The third argument is y set to 15');
	t.equals(result.description, 'moving the .so-what element to new coordinates.', 'The test description is correct');
	t.equals(methodsCalled.moveTo, 1, 'The browser.moveTo() method was called.');

	t.end();

});

/**
 * Tests for the setCookie action.
 */

test('Execute a setCookie action', function(t) {

	var result;
	var setCookieAction;

	setCookieAction = {
		execute: {
			action: 'setCookie',
			name: 'cookieMonster',
			value: 'COOKIES!'
		}
	};

	result = drive.execute(setCookieAction);

	t.equals(result.method, 'setCookie', 'The browser method is setCookie()');
	t.equals(result.args[0].name, 'cookieMonster', 'The test method has an args object with a name key of "cookieMonster".');
	t.equals(result.args[0].value, 'COOKIES!', 'The test method has an args object with a value key of "COOKIES!"');
	t.equals(result.description, 'setting a cookie with name: "cookieMonster" and value: "COOKIES!"', 'The test description is correct.');
	t.equals(methodsCalled.setCookie, 1, 'The browser.setCookie() method was called.');

	t.end();

});

/**
 * Tests the deleteCookie action.
 */

test('Execute a deleteCookie action', function(t) {

	var result;
	var deleteSingleCookieAction;
	var deleteAllCookiesAction;

	deleteSingleCookieAction = {
		execute: {
			action: 'deleteCookie',
			name: 'cookieMonster'
		}
	};

	deleteAllCookiesAction = {
		execute: {
			action: 'deleteCookie'
		}
	};

	result = drive.execute(deleteSingleCookieAction);

	t.equals(result.method, 'deleteCookie', 'The browser method is deleteCookie()');
	t.equals(result.args[0], 'cookieMonster', 'The test method is passed a name argument of "cookieMonster".');
	t.equals(result.description, 'deleting a cookie with name: "cookieMonster"', 'The test description is correct.');
	t.equals(methodsCalled.deleteCookie, 1, 'The browser.deleteCookie() method was called.');

	result = drive.execute(deleteAllCookiesAction);

	t.equals(result.args.length, 0, 'The test method doesn\'t have any arguments');
	t.equals(result.description, 'deleting all the cookies', 'The test description is correct.');
	t.equals(methodsCalled.deleteCookie, 2, 'The browser.deleteCooke() method was called again.');

	t.end();

});