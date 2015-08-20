var argv = require('minimist'),
		chai = require('chai'),
		helpers,
		drive;

helpers = {

	/**
	 * @function helpers.testProperty()
	 *
	 * @description Used to test a property against its assertion value, using the chaiJS
	 * functions we pass in.
	 *
	 * @param args - The object we pass in to run the test. The object has three properties:
	 * args.data, the value we're testing. Args.assert, the value args.data should be,
	 * and args.mode, the chaiJS functions to run, like "be at least".
	 *
	 * @return a boolean that determines if the test passed or failed
	 */

	testProperty: function(args) {

		// First, we test if the data that was passed in is an Array. We do this because CSS selectors
		// can easily return more than one element. If the data is an array, then grab the first element
		// of the array, otherwise, use the args.data property as is.

		if (Array.isArray(args.data)) args.data = args.data[0];

		var value = (typeof args.data === "object" ? args.data.value : args.data),
			propertyValue = helpers.parseValue(value, args.assert),
			assertion = (propertyValue).should,
			fn = assertion;

		for (var i = 0, len = args.mode.length - 1; i < len; i++) {
			fn = fn[args.mode[i]];
		}

		return fn[args.mode[args.mode.length - 1]](args.assert);

	},

	getChaiAsserts: function(assertMode, defaultAssert) {

		defaultAssert = (defaultAssert) ? defaultAssert : ['equal'];

		return (assertMode) ? assertMode.split(' ') : defaultAssert;

	},

	buildChaiAssertString: function(modes) {

		var modeString = modes.join(' ');

		return 'should ' + modeString;

	},

	clickDescription: function(int) {

		var desc;

		switch (int) {

			case 0:
				desc = "left";
				break;
			case 1:
				desc = "middle";
				break;
			case 2:
				desc = "right";
				break;

		}

		return desc;

	},

	executeProperties: function(args) {

		if (!args.asserts) {
			throw new Error("You're missing an \"asserts\" object. Make sure it's plural.");
		}

		var assertKeys = (Array.isArray(args.asserts)) ? args.asserts : Object.keys(args.asserts),
			test;

		assertKeys.forEach(function(assertKey, index) { // assertKey is the thing being verified.

			var browserName = browser.desiredCapabilities.browserName,
				assert;

			// Add the ability for the asserts object to be an array of objects so that we can use the same property key
			// multiple times and check for different shit. Usable for checking multiple parts of a background-image
			// as an example.

			if (args.asserts && args.asserts[index]) {
				assertKey = Object.keys(args.asserts[index])[0];
				assert = args.asserts[index][assertKey];
			} else {
				assert = args.asserts[assertKey];  // assert: The property value
			}

			// Add the ability to support browser specific values for verify object.
			if (args && args['asserts-' + browserName] && args['asserts-' + browserName][assertKey]) {

				assert = args['asserts-' + browserName][assertKey];

			}

			// Add the ability to support browser specific values when the asserts is an array of objects.

			if (args && args['asserts-' + browserName] && args['asserts-' + browserName][index]) {

				if (args['asserts-' + browserName][index]) {
					assertKey = Object.keys(args['asserts-' + browserName][index])[0];
					assert = args['asserts-' + browserName][index][assertKey];
				} else {
					assert = args['asserts-' + browserName][assertKey];
				}

			}

			test = {
				"selector": args.selector,
				"assertKey": assertKey,
				"assert": assert,
				"mode": args.mode
			};

			drive[args.method](test);

		});

	},


	handleEvents: function(args) {

		var browserName = browser.desiredCapabilities.browserName;

		args.actions.forEach(function(action, index) {

			var actionKey = Object.keys(action)[0],
				actionContainer = args.actions[index][actionKey],
				actionAssertMethod = helpers.getChaiAsserts(action[actionKey]["assert-mode"], actionContainer["assert-mode"]),
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

					helpers.executeProperties(actionConfig);

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

					helpers.executeProperties(actionConfig);

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

						helpers.executeProperties(args);

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

					helpers.executeProperties(actionConfig);

					break;

			}

		});

	},

	/**
	 * @function helpers.parseValue()
	 *
	 * @description Used to parse a property value based on the value given as the assertion value
	 *
	 * @param value - the property value that needs to be parsed (Can be a string, int, or float)
	 * @param assertion - the assertion for the given property. (Can be a string, int, or float)
	 *
	 * @return the parsed value based on the type of the assertion
	 */

	parseValue: function(value, assertion) {

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

};

drive = {

	setup: function() {

		/** This if block only gets called if the module is instantiated outside of the grunt task
		 *  (during unit tests is the only time that happens). With the grunt task, the browser
		 *  object is expected to be global, so we're just creating our own browser object for
		 *  testing when it doesn't exist.
		 */

		if (typeof browser === "undefined") {
			browser = require('webdriverio').remote();
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

		if (typeof browser !== "undefined") {

			if (!browser.executeAndStore) {

				browser.addCommand("executeAndStore", function(script, resultKey, cb) {

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

		var steps = obj.steps,
			browserName = browser.desiredCapabilities.browserName;

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

						var assertMode = helpers.getChaiAsserts(verification["assert-mode"]);

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

						helpers.executeProperties(test);

						if (verification.then && Array.isArray(verification.then)) {
							helpers.handleEvents(test)
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
				clickDesc = helpers.clickDescription(args.execute.button);
				testMethod = "buttonDown";
				testDesc = 'pushing the ' + clickDesc + ' click down';
				testArgs = [args.execute.button];
				break;
			case "buttonUp":
				clickDesc = helpers.clickDescription(args.execute.button);
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

		it('the "' + args.assertKey + '" property of "' + args.selector + '" ' + helpers.buildChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

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
						helpers.testProperty(test);
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

		it('the "' + args.assertKey + '" property of "' + args.selector + '" ' + helpers.buildChaiAssertString(args.mode) + ' the local storage value in key "' + originalAssertKey + '"', function(done) {

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

						helpers.testProperty(test);

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

					helpers.testProperty(test);
				}

			})
				.call(done);

		});

	},

	verifyText: function(args) {

		it('the "' + args.selector + '" element\'s text ' + helpers.buildChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

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

						helpers.testProperty(test);
					}

				})
				.call(done);
		});

	},

	verifyAttribute: function(args) {

		it('the "' + args.assertKey + '" attribute of "' + args.selector + '" ' + helpers.buildChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

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

							helpers.testProperty(test);

						} else {
							return (data === null).should.be.true;
						}

					}

				})
				.call(done);

		});

	},

	verifyUrl: function(args) {

		it('the "' + args.assertKey + '" of this page is ' + helpers.buildChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

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

						helpers.testProperty(test);

					}

				})
				.call(done);

		});

	},

	verifyPageTitle: function(args) {

		it('the "' + args.assertKey + '" of this page ' + helpers.buildChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

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

						helpers.testProperty(test);

					}

				})
				.call(done);

		});

	},

	verifyCount: function(args) {

		it('the number of "' + args.selector + '" elements on the page ' + helpers.buildChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

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

						helpers.testProperty(test);

					}

				})
				.call(done);

		});

	},

	verifyScriptResult: function(args) {

		it('evaluating "' + args.selector + '" returns a result that ' + helpers.buildChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

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

						helpers.testProperty(test);

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