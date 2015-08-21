var argv = require('minimist');
var chai = require('chai');
var drive;
var browserName;

/**
 * Every property that gets tested with datadriver comes through here.
 * @param args {object}
 */

function testProperty(args) {

	/**
	 * Right now, we only test for one property at a time. If args.data returns
	 * an array, just grab the first object in the array.
	 */

	var testData = (Array.isArray(args.data)) ? args.data[0] : args.data;

	/**
	 * Check our testData to see if it's an object (probably is). If so,
	 * grab the value property, otherwise, just return the whole thing, whatever it is.
	 */

	var value = (typeof testData === "object" ? testData.value : testData);

	/**
	 * Now we parse the value in to something we can run asserts on. Doesn't
	 * matter if our value is a string, an integer, a float, a boolean, whatever.
	 * We should be able to return the correct parsed value and run our asserts.
	 */

	var propertyValue = parseValue(value, args.assert);

	/**
	 * Encapsulate the should() interface applied to our property value. We might
	 * consider making the actual Chai interface optional, with expect() as the default.
	 */

	var fn = (propertyValue).should;

	/**
	 * For every other chai assert mode that we pass, we should apply it to our
	 * property value. This only works right now for assert modes that don't
	 * have multiple arguments. Simple modes like "below", "above", "at least",
	 * "eql", etc.
	 */

	for (var i = 0, len = args.mode.length - 1; i < len; i++) {
		fn = fn[args.mode[i]];
	}

	/**
	 * Return the Chai.js object back to our test runner. This is equivalent to
	 * something like "test1".should.be.equal.to("test1"). If the assertion doesn't
	 * pass, Chai will throw an Assertion Error back to the test runner.
	 */

	return fn[args.mode[args.mode.length - 1]](args.assert);

}

/**
 * The assertions we want to run on a given property are parsed here.
 * @param assertMode
 * @param defaultAssert
 * @returns {array}
 */

function getChaiAsserts(assertMode, defaultAssert) {

	/**
	 * First, we check to see if we're passing in a default assertion mode.
	 * If this is undefined, we default to "equal" as a default assertion mode.
	 */

	defaultAssert = (defaultAssert) ? defaultAssert.split(' ') : ['equal'];

	/**
	 * Then we check to see if we passed in an assertion mode ovveride. If we
	 * don't, we just return ['equal']. If we do, we split the string we passed
	 * in, so that we can pass thos on in an array. For example: "be above" gets
	 * returned here as ['be', 'above'].
	 */

	return (assertMode) ? assertMode.split(' ') : defaultAssert;

}

/**
 * A simple function for building up our assertion mode description string
 * @param modes
 * @returns {string}
 */

function getChaiAssertString(modes) {

	var modeString = modes.join(' ');

	return 'should ' + modeString;

}

/**
 * This is another test description helper, specifically for the buttonUp and
 * buttonDown actions.
 * @param int
 * @returns {string}
 */

function getClickDescription(int) {

	switch (int) {
		case 0:
			return 'left';
			break;
		case 1:
			return 'middle';
			break;
		case 2:
			return 'right';
			break;
	}

}

/**
 * Return the name of the browser we are using.
 * @returns {string}
 */

function getBrowserName() {
	return browserName = browser.desiredCapabilities.browserName;
}

/**
 * A method that normalizes what we're trying to test across browsers, allowing
 * for property overrides based on browser specific assert objects.
 *
 * @param args {object}
 *
 * Will look something like this:
 *
 * {
 *   step: {
 *     selector: '.grid--third',
 *     verify: [ [Object] ]
 *   },
 *   verifyIndex: 0,
 *   selector: '.grid--third',
 *   method: 'verifyCount',
 *   asserts: { count: 2 },
 *   mode: [ 'be', 'above' ],
 *   actions: undefined
 * }
 *
 */

function testProperties(args) {

	/**
	 * A lot of times, people forget to name the "asserts" object in its plural form.
	 * This little block catches that and gives them something to look for.
	 */

	if (!args.asserts) {
		throw new Error('You\'re missing an "asserts" object. Make sure it\'s plural.');
	}

	/**
	 * The asserts object can take two forms. The most common form is an object, like this:
	 *
	 * "asserts": {
	 *   "background-color": "rgba(0,0,0,1)",
	 *   "cursor": "pointer"
	 * }
	 *
	 * However, the asserts object can also be an array, usually because we're dealing with
	 * asserting different parts of the same property. For example, a CSS gradient:
	 *
	 * "asserts": [
	 *   { "background-image": "225deg" },
	 *   { "background-image": "rgb(40, 37, 96)" },
	 *   { "background-image": "rgb(218, 31, 39)" },
	 *   { "background-image": "rgb(243, 164, 53)" }
	 * ]
	 *
	 */

	var assertKeys = (Array.isArray(args.asserts)) ? args.asserts : Object.keys(args.asserts);
	var tests = [];

	/**
	 * Alright. We have the key to the thing we're asserting. Let's go. LOOP.
	 */

	assertKeys.forEach(function(assertKey, index) {

		var test;
		var assert;

		/**
		 * So here is where things start to get a bit messy. We need to find out what we're actually
		 * asserting. So we test to see if we are in an asserts array and if we are, we grab the first
		 * object we find and get the first key (since there will only be one) and figure out the appropriate assert.
		 *
		 * Otherwise, we're in an object and we just need to grab the value from the asserts object
		 * using the assertKey we already know about.
		 *
		 */

		if (args.asserts && args.asserts[index]) {
			assertKey = Object.keys(args.asserts[index])[0];
			assert = args.asserts[index][assertKey];
		} else {
			assert = args.asserts[assertKey];
		}


		/**
		 * Now we need to start checking for browser specific properties on asserts objects. We don't
		 * want to redeclare every property for every browser, so if a browser doesn't have an override, it just
		 * defaults to what's in the normal asserts object. However, if a property exists in "asserts-firefox" or
		 * "asserts-ie9", then that property will be used for the test over the defaults.
		 */

		if (args && args['asserts-' + browserName] && args['asserts-' + browserName][assertKey]) {
			assert = args['asserts-' + browserName][assertKey];
		}

		/**
		 * Now, we want do do what we did above, but for asserts that are really an array of objects. This is a bit
		 * more complicated, but doable. We're following the logic above, where we figure out if we're inside an
		 * asserts array, if we are, we can figure out the assert key we're looking for.
		 *
		 * TODO: Figure out if we really need that else statement.
		 */

		if (args && args['asserts-' + browserName] && args['asserts-' + browserName][index]) {

			if (args['asserts-' + browserName][index]) {
				assertKey = Object.keys(args['asserts-' + browserName][index])[0];
				assert = args['asserts-' + browserName][index][assertKey];
			} else {
				assert = args['asserts-' + browserName][assertKey];
			}

		}

		/**
		 * Ok. Now that everything is normalized, we have enough information for one single test.
		 * We need four pieces of information combined with an assert method to run a verification test.
		 * @type {object}
		 */

		test = {
			"selector": args.selector,
			"assertKey": assertKey,
			"assert": assert,
			"mode": args.mode
		};

		/**
		 * Take your test object and apply it to the right verification method. Congratulations. Fuck.
		 */

		drive[args.method](test);

		/**
		 * Push the tests that are generated to the tests array. For testing.
		 */

		tests.push(test);

	});

	/**
	 * Return this object for testing. There's probably a better way to do this. But kind of clever because
	 * the module will never ask for a return value in real usage, therefore, this object will be null
	 * unless the method is called in a statement as opposed to an expression.
	 */

	return tests;

}

function fireEvents(args) {

	args.actions.forEach(function(action, index) {

		var actionKey = Object.keys(action)[0],
			actionContainer = args.actions[index][actionKey],
			actionAssertMethod = getChaiAsserts(action[actionKey]["assert-mode"], actionContainer["assert-mode"]),
			actionConfig,
			clickOn,
			clickOff,
			moveTo,
			pause;

		switch (actionKey) {

			case "hover":

				actionConfig = {
					"step": args.step,
					"selector": args.selector,
					"method": args.method,
					"asserts": actionContainer.asserts,
					"mode": actionAssertMethod
				};

				if (typeof actionContainer["asserts-" + browserName] !== "undefined") {
					actionConfig["asserts-" + browserName] = actionContainer["asserts-" + browserName];
				}

				moveTo = {
					"selector": args.selector,
					"execute": {"action": "hover"}
				};

				pause = {
					selector: args.selector,
					execute: {"action": "pause", "time": 350}
				};

				drive.execute(moveTo);

				drive.execute(pause);

				testProperties(actionConfig);

				break;

			case "click":

				actionConfig = {
					"step": args.step,
					"selector": args.selector,
					"method": args.method,
					"asserts": actionContainer.asserts,
					"mode": actionAssertMethod
				};

				clickOn = {
					selector: actionContainer.on || args.selector,
					execute: {"action": "click"}
				};

				pause = {
					selector: actionContainer.on || args.selector,
					execute: {"action": "pause", "time": 150}
				};

				drive.execute(clickOn);

				drive.execute(pause);

				testProperties(actionConfig);

				if (actionContainer.off) {

					clickOff = {
						selector: actionContainer.off,
						execute: {"action": "click"}
					};

					pause = {
						selector: actionContainer.off,
						execute: {"action": "pause", "time": 150}
					};

					drive.execute(clickOff);

					drive.execute(pause);

					testProperties(args);

				}

				break;

			case "move":

				actionConfig = {
					"step": args.step,
					"selector": args.selector,
					"method": args.method,
					"asserts": actionContainer.asserts,
					"mode": actionAssertMethod
				};

				pause = {
					selector: args.selector,
					execute: {"action": "pause", "time": 350}
				};

				moveTo = {
					selector: actionContainer.to || args.selector,
					execute: {"action": "hover"}
				};

				drive.execute(moveTo);

				drive.execute(pause);

				testProperties(actionConfig);

				break;

		}

	});

}

/**
 * @function parseValue()
 *
 * @description Used to parse a property value based on the value given as the assertion value
 *
 * @param value - the property value that needs to be parsed (Can be a string, int, or float)
 * @param assertion - the assertion for the given property. (Can be a string, int, or float)
 *
 * @return the parsed value based on the type of the assertion
 */

function parseValue(value, assertion) {

	var parsedValue = value; //Default is unparsed (a string)

	// Check if the value and the property are parseable
	if (!isNaN(parseFloat(assertion)) && !isNaN(parseFloat(value))) {

		// Make sure the value isn't a string with a space in it (like background-position)

		if (typeof value === 'string' && value.indexOf(' ') !== -1) {
			return parsedValue;
		}

		// If the assertion is an integer then parse the value as such. If not parse as a float.

		if (assertion % 1 === 0) {
			parsedValue = parseInt(value, 10);
		} else {
			parsedValue = parseFloat(value);
		}

	}

	parsedValue = (parsedValue === "true") ? true : parsedValue;

	parsedValue = (parsedValue === "false") ? false : parsedValue;

	return parsedValue

}

drive = {

	setup: function() {

		/** This if block only gets called if the module is instantiated outside of the grunt task
		 *  (during unit tests is the only time that happens). With the grunt task, the browser
		 *  object is expected to be global, so we're just creating our own browser object for
		 *  testing when it doesn't exist.
		 */

		if (typeof browser === 'undefined') {
			browser = require('webdriverio').remote();
			it = function(title, fn) {};
		}

		/**
		 *  Initialize the should() interface for Chai. Might be interesting to make this optional
		 *  somehow in the future.
		 */

		chai.should();

		/**
		 *  If the browser object is defined, then add a custom command to the object (part of
		 *  WebdriverIO's API) that allows us to execute some JavaScript during the test and
		 *  store the result in local storage with a key that we define.
		 */

		if (typeof browser !== 'undefined') {

			if (!browser.executeAndStore) {

				browser.addCommand('executeAndStore', function(script, resultKey, cb) {

					this.execute(script, resultKey, function(err, ret) {

						if (err) {
							throw new Error(err);
						} else {
							browser.execute('localStorage.setItem("' + resultKey + '", "' + ret.value + "" + '")');
						}

					});

					cb();

				});

			}

			/**
			 * Get the name of the browser we're using.
			 */

			browserName = getBrowserName();

		}

		/**
		 *  The return object is only for unit testing. It gets popped off when the setup() method isn't
		 *  assigned to a variable. There is probably a better way to do this.
		 */

		return {
			chai: chai
		};

	},

	getBaseUrl: function() {

		/**
		 *  If we get a option from the CLI in the form of --url=http://test.com (or some other url),
		 *  that becomes our baseUrl. Otherwise, we default to localhost:3000.
		 */

		var args = argv(process.argv.slice(3));
		var url = args.url;
		var baseUrl;

		if ((typeof url !== 'undefined' && url !== '')) {
			baseUrl = url + '/'
		} else {
			baseUrl = 'http://localhost:3000/'
		}

		return baseUrl;

	},

	// ==============================================================================
	// @function verify()
	//
	// @description Our root function. It's only a wrapper for more specific
	// functions.
	//
	// @param obj Takes a data object
	// ==============================================================================

	verify: function(obj) {

		var steps = obj.steps;

		steps.forEach(function(step, index) {

			var selector = step.selector || 'window',
				actionKeys = Object.keys(steps[index]);

			actionKeys.forEach(function(key) {

				switch (key) {

					case 'selector':
						return false;
					case 'verify':
						verifyStep();
						break;
					case 'execute':
						executeStep();
						break;
					default:

				}

			});

			function verifyStep() {

				if (typeof steps[index].verify !== 'undefined') {

					steps[index].verify.forEach(function(verification, verifyIndex) {

						var assertMode = getChaiAsserts(verification["assert-mode"]);

						var test = {
							"step": step,
							"verifyIndex": verifyIndex,
							"selector": selector,
							"method": verification.method,
							"asserts": verification.asserts,
							"mode": assertMode,
							"actions": verification.then
						};

						if (typeof verification["asserts-" + browserName] !== "undefined") {
							test["asserts-" + browserName] = verification["asserts-" + browserName];
						}

						testProperties(test);

						if (verification.then && Array.isArray(verification.then)) {
							fireEvents(test)
						}

					});

				}

			}

			function executeStep() {

				if (typeof steps[index].execute !== 'undefined') {

					steps[index].execute.forEach(function(action) {

						var theAction = {
							"selector": selector,
							"execute": action
						};

						drive.execute(theAction);

					});

				}

			}

		});

	},

	execute: function(args) {

		var testMethod,
			testDesc,
			testArgs,
			clickDesc,
			execTest = (typeof action !== 'undefined') ? action : it;

		switch (args.execute.action) {

			case "type":
				testMethod = "setValue";
				testDesc = 'executing "' + testMethod + '" on "' + args.selector + '".';
				testArgs = [args.selector, args.execute.text];
				break;
			case "refresh":
				testMethod = "refresh";
				testDesc = 'executing a browser ' + testMethod + ' on the current page';
				testArgs = [];
				break;
			case "pause":
				var pauseSelector = args.selector ? args.selector : 'window';
				testMethod = "pause";
				testDesc = 'pausing on "' + pauseSelector + '" for ' + args.execute.time + ' milliseconds.';
				testArgs = [args.execute.time];
				break;
			case "hover":
				testMethod = "moveToObject";
				testDesc = 'moving to the center of the "' + args.selector + '" element.';
				testArgs = [args.selector, 5, 5];
				break;
			case "click":
				testMethod = "click";
				testDesc = 'clicking the "' + args.selector + '" element.';
				testArgs = [args.selector];
				break;
			case "redirect":
				testMethod = "url";
				testDesc = (args.execute.page.indexOf('http://') === 0 || args.execute.page.indexOf('https://') === 0) ? 'redirecting to ' + args.execute.page : 'redirecting to "' + this.getBaseUrl() + args.execute.page + '"';
				testArgs = (args.execute.page.indexOf('http://') === 0 || args.execute.page.indexOf('https://') === 0) ? [args.execute.page] : [this.getBaseUrl() + args.execute.page];
				break;
			case "setViewportSize":
				testMethod = "setViewportSize";
				testDesc = "giving the viewport a height of " + args.execute.height + " and a width of " + args.execute.width;
				testArgs = [{ height: args.execute.height, width: args.execute.width }];
				break;
			case "eval":
				testMethod = "execute";
				testDesc = 'executing javascript ' + args.execute.script;
				testArgs = [args.execute.script];
				break;
			case "evalAndStore":
				testMethod = "executeAndStore";
				testDesc = 'executing javascript and storing the result in local storage.';
				testArgs = [args.execute.script, args.execute.resultKey];
				break;
			case "sendKeystroke":
				testMethod = "keys";
				testDesc = 'sending keystroke(s) ' + args.execute.keystrokes;
				testArgs = [args.execute.keystrokes];
				break;
			case "buttonDown":
				clickDesc = getClickDescription(args.execute.button);
				testMethod = "buttonDown";
				testDesc = 'pushing the ' + clickDesc + ' click down';
				testArgs = [args.execute.button];
				break;
			case "buttonUp":
				clickDesc = getClickDescription(args.execute.button);
				testMethod = "buttonUp";
				testDesc = 'releasing the ' + clickDesc + ' click';
				testArgs = [args.execute.button];
				break;
			case "moveTo":
				testMethod = "moveTo";
				testDesc = 'moving the ' + args.selector + ' to new coordinates.';
				testArgs = [null, args.execute.x, args.execute.y];
				break;
			case "setCookie":
				testMethod = "setCookie";
				testDesc = 'setting a cookie with name: ' + args.execute.name + ' and value: ' + args.execute.value;
				testArgs = [{name: args.execute.name, value: args.execute.value}];
				break;
			case "deleteCookie":
				testMethod = "deleteCookie";
				if (args.execute.name) {
					testDesc = 'deleting a cookie with name: ' + args.execute.name;
					testArgs = [args.execute.name];
				} else {
					testDesc = 'deleting all the cookies';
					testArgs = [];
				}
				break;
			case 'newWindow':
				testMethod = 'newWindow';
				testDesc = 'opening a new tab to the url: ' + args.execute.url;
				testArgs = [args.execute.url];
				break;
			case 'switchTab':

				var tabList = null;

				execTest('retrieving tab list', function(done) {

					browser.getTabIds().then(function(data) {

						var doneInterval = setInterval(function() {

							if (data) {
								tabList = data;
								clearInterval(doneInterval);
								return browser.switchTab(tabList[args.execute.index]).then(function() {
									browser.call(done);
								});
							}

						}, 500);

					});

				});

				testMethod = 'log';
				testDesc = 'current tab has been switched to selected index';
				testArgs = ['browser'];

				break;
			case 'closeTab':

				var tabList = null;

				execTest('retrieving tab list', function(done) {

					browser.getTabIds().then(function(data) {

						var doneInterval = setInterval(function() {

							if (data) {
								tabList = data;
								clearInterval(doneInterval);
								return browser.close(tabList[args.execute.index]).then(function() {
									browser.call(done);
								});
							}

						}, 500);

					});

				});

				testMethod = 'log';
				testDesc = 'current tab has been closed';
				testArgs = ['browser'];

				break;
		}

		execTest(testDesc, function(done) {

			var fn = browser[testMethod];

			fn.apply(browser, testArgs);

			browser.call(done);

		});

	},

	verifyCssProperty: function(args) {

		it('the "' + args.assertKey + '" property of "' + args.selector + '" ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser
				.getCssProperty(args.selector, args.assertKey, function(err, data) {

					var test = {
						"data": data,
						"assert": args.assert,
						"mode": args.mode
					};

					if (err) {
						throw new Error(err);
					} else {
						testProperty(test);
					}

				})
				.call(done);

		});

	},

	verifyStoredCssProperty: function(args) {

		var storedValue,
				originalAssertKey = args.assert,
				execTest = (typeof action !== 'undefined') ? action : it;

		execTest('Retrieving values from local storage...', function(done) {

			browser
				.execute('return localStorage.getItem("' + args.assert + '");', null, function(err, data) {

					if (err) {
						throw new Error(err);
					} else {
						storedValue = parseFloat(data.value);
					}

				})
				.call(done);

		});

		execTest('Reading values...', function(done) {
			browser.call(done);
		});

		it('the "' + args.assertKey + '" property of "' + args.selector + '" ' + getChaiAssertString(args.mode) + ' the local storage value in key "' + originalAssertKey + '"', function(done) {

			browser
				.getCssProperty(args.selector, args.assertKey, function(err, data) {

					if (err) {
						throw new Error(err);
					} else {

						var test = {
							"data": data,
							"assert": storedValue,
							"mode": args.mode
						};

						testProperty(test);

					}

				})
				.call(done);

		});

	},

	verifyState: function(args) {

		var methodVerb;

		switch (args.assertKey) {
			case "isExisting":
				methodVerb = (args.assert) ? "exists" : "does not exist";
				break;
			case "isVisible":
				methodVerb = (args.assert) ? "is visible" : "is not visible";
				break;
			case "isEnabled":
				methodVerb = (args.assert) ? "is enabled" : "is not enabled";
				break;
			case "isSelected":
				methodVerb = (args.assert) ? "is selected" : "is not selected";
				break;
		}

		it('the "' + args.selector + '" element ' + methodVerb + ' on the page', function(done) {

			browser
				[args.assertKey](args.selector, function(err, data) {

				if (err) {
					throw new Error(err);
				} else {

					var test = {
						"data": data,
						"assert": args.assert,
						"mode": args.mode
					};

					testProperty(test);
				}

			})
				.call(done);

		});

	},

	verifyText: function(args) {

		it('the "' + args.selector + '" element\'s text ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser
				.getText(args.selector, function(err, data) {

					if (err) {
						throw new Error(err);
					} else {

						var test = {
							"data": data,
							"assert": args.assert,
							"mode": args.mode
						};

						testProperty(test);
					}

				})
				.call(done);
		});

	},

	verifyAttribute: function(args) {

		it('the "' + args.assertKey + '" attribute of "' + args.selector + '" ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser
				.getAttribute(args.selector, args.assertKey, function(err, data) {

					if (err) {
						throw new Error(err);
					} else {

						var test = {
							"data": data,
							"assert": args.assert,
							"mode": args.mode
						};

						if (data !== null) {

							testProperty(test);

						} else {
							return (data === null).should.be.true;
						}

					}

				})
				.call(done);

		});

	},

	verifyUrl: function(args) {

		it('the "' + args.assertKey + '" of this page is ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser
				.url(function(err, data) {

					if (err) {
						throw new Error(err);
					} else {

						var test = {
							"data": data,
							"assert": args.assert,
							"mode": args.mode
						};

						testProperty(test);

					}

				})
				.call(done);

		});

	},

	verifyPageTitle: function(args) {

		it('the "' + args.assertKey + '" of this page ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser
				.title(function(err, data) {

					if (err) {
						throw new Error(err);
					} else {

						var test = {
							"data": data,
							"assert": args.assert,
							"mode": args.mode
						};

						testProperty(test);

					}

				})
				.call(done);

		});

	},

	verifyCount: function(args) {

		it('the number of "' + args.selector + '" elements on the page ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser
				.elements(args.selector, function(err, data) {

					if (err) {
						throw new Error(err);
					} else {

						var test = {
							"data": data.value.length,
							"assert": args.assert,
							"mode": args.mode
						};

						testProperty(test);

					}

				})
				.call(done);

		});

	},

	verifyScriptResult: function(args) {

		it('evaluating "' + args.selector + '" returns a result that ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser
				.execute(args.selector, function(err, data) {

					if (err) {
						throw new Error(err);
					} else {

						var test = {
							"data": data.value,
							"assert": args.assert,
							"mode": args.mode
						};

						testProperty(test);

					}

				})
				.call(done);

		});

	},

	go: function(obj) {

		var useViewports = browser.desiredCapabilities.viewports;

		if (!obj.config.description) {
			console.trace("Your test configuration is missing a description.\n\"config\": {\n  \"description\": \"This is a description.\" \n}");
			return false;
		}

		if (!obj.config.suites) {
			console.trace("Your test configuration is missing a \"suites\" array. \n\"config\": {\n  \"suites\": [\n    {\n      \"description\": \"Verify colors\",\n      \"tests\": [\"color-styles\"],\n      \"viewports\": {\n        \"large\": true\n      }\n    }\n  ] \n}");
			return false;
		}

		if (!Array.isArray(obj.config.suites)) {
			console.trace("Your test configuration needs a \"suites\" array.  Are you using an object?\n\"config\": {\n  \"suites\": [\n    {\n      \"description\": \"Verify colors\",\n      \"tests\": [\"color-styles\"],\n      \"viewports\": {\n        \"large\": true\n      }\n    }\n  ] \n}");
			return false;
		}

		describe(obj.config.description, function() {

			// ======================================================================
			// Navigate to the url we need to run these tests. We get the base of
			// the url from the drive module.
			// ======================================================================

			before(function(done) {

				var goUrl = (!obj.config.url) ? drive.getBaseUrl() : drive.getBaseUrl() + obj.config.url;

				browser
					.url(goUrl)
					.call(done);

			});

			obj.config.suites.forEach(function(testSuite) {

				if (!testSuite.description) {
					console.trace("Your suite is missing a description.\n\"suites\": [\n  {\n    \"description\": \"Verify colors\",\n    \"tests\": [\"color-styles\"],\n    \"viewports\": {\n      \"large\": true\n    }\n  }\n]");
					return false;
				}

				if (!testSuite.tests) {
					console.trace("Your suite is missing a \"tests\" array.\n\"suites\": [\n  {\n    \"description\": \"Verify colors\",\n    \"tests\": [\"color-styles\"],\n    \"viewports\": {\n      \"large\": true\n    }\n  }\n]");
					return false;
				}

				if (!Array.isArray(testSuite.tests)) {
					console.trace("Your suite needs to have a \"tests\" array. Are you using an object?\n\"suites\": [\n  {\n    \"description\": \"Verify colors\",\n    \"tests\": [\"color-styles\"],\n    \"viewports\": {\n      \"large\": true\n    }\n  }\n]");
					return false;
				}

				if (!testSuite.viewports) {
					console.trace("Your suite is missing a \"viewports\" object.\n\"suites\": [\n  {\n    \"description\": \"Verify colors\",\n    \"tests\": [\"color-styles\"],\n    \"viewports\": {\n      \"large\": true\n    }\n  }\n]");
					return false;
				}

				var viewportKeys = Object.keys(testSuite.viewports);

				viewportKeys.forEach(function(viewport, viewportIndex) {

					if (testSuite.viewports[viewport] && (useViewports[viewportKeys[viewportIndex]] || testSuite.force)) {

						describe('Rendered in a ' + viewport + ' viewport', function() {

							before(function(done) {

								browser
									.setViewportSize(browser.desiredCapabilities.viewports[viewport])
									.pause(1000)
									.call(done);

							});

							describe(testSuite.description, function() {

								testSuite.tests.forEach(function(test) {

									if (!obj[test].steps) {
										console.warn("Your test object is missing a \"steps\" array.\n\"steps\": [\n  {\n    \"selector\": \".panel\",\n    \"verify\": [\n      {\n        \"method\": \"verifyCount\",\n         \"asserts\": {\n           \"count\": 13\n        }\n      }\n    ]\n  }\n]");
										return false;
									}

									if (obj[test] && obj[test].steps) {
										drive.verify(obj[test]);
									}

								});

							});

						});

					}

				});

			});

		});

	}

};

module.exports = drive;

drive.setup();