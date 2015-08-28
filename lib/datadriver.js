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

	var value = (typeof testData === 'object' ? testData.value : testData);

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
			selector: args.selector,
			assertKey: assertKey,
			assert: assert,
			mode: args.mode
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

/**
 * The fireEvents() function is a special function for executing actions on an element that we've already
 * verified properties on. For example, I selected a button, verified its CSS properties and now I want to hover
 * on that same button (same selector) and then execute some more properties. You can accomplish the same thing
 * with a combination of verify and execution steps, but this method gives you just a little more flexibility.
 *
 * @param args {object}
 *
 * Our args object will look something like this:
 *
 * {
 *   "selector": "a[href*=\"api/methods/execute.html\"]",
 *   "method": "verifyCssProperty",
 *   "asserts": {
 *     "color": "rgba(213,72,90,1)"
 *   },
 *   "mode": [ "equal" ],
 *   "actions": [
 *     {
 *       "hover": {
 *         "asserts": {
 *           "color": "rgba(170,39,56,1)"
 *         }
 *       }
 *     }
 *   ]
 * }
 *
 */

function fireEvents(args) {

	/**
	 * Keep track of the tests that are outputted for unit test verification.
	 * @type {Array}
	 */

	var tests = [];

	/**
	 * Ok. So this is going to go through any action objects captured by the "then" key
	 * of a verification block. These events are special in the fact that they're meant
	 * to satisfy a use case of verifying properties of a selector after you click on another
	 * element or hover over the same element or move to a different element. It's important
	 * to note that the verification properties inside the "then" actions apply to the original
	 * selector above the "verify" block.
	 */

	args.actions.forEach(function(action, index) {

		/**
		 * This corresponds to the key of the action. "click", "hover", "move".
		 */

		var testKey = Object.keys(action)[0];

		/**
		 * Our test container refers to the immediate object of the test key. So for example,
		 * anything inside of a click: {} block. Our test container is {} itself.
		 */

		var testContainer = args.actions[index][testKey];

		/**
		 * The testAssertMode can be overridden in the test container, unlike the selector or verification method.
		 * @type {array}
		 */

		var testAssertMode = getChaiAsserts(action[testKey]['assert-mode'], testContainer['assert-mode']);

		/**
		 * We'll reuse this variable throughout the function.
		 */

		var test;

		/**
		 * Depending on what the test key is, we want to do different shit.
		 */

		switch (testKey) {

			case 'hover':

				/**
				 * In our hover case, our test uses the original selector and original verification method. However,
				 * the assert mode and asserts object is overridden and the assert mode can be overridden, but has
				 * a smart default.
				 *
				 * @type {{selector: *, method: *, asserts: *, mode: array}}
				 */

				test = {
					selector: args.selector,
					method: args.method,
					asserts: testContainer.asserts,
					mode: testAssertMode
				};

				/**
				 * If our test container has a browser-specific asserts object, then add it to the test configuration.
				 */

				if (typeof testContainer['asserts-' + browserName] !== 'undefined') {
					test['asserts-' + browserName] = testContainer['asserts-' + browserName];
				}

				/**
				 * We're taking the work out of calling the hover actions by writing the code ourselves. So execute
				 * a hover action and then pause for 350 milliseconds. We might make the pause time configurable in
				 * the future.
				 */

				drive.execute({
					selector: args.selector,
					execute: { action: 'hover' }
				});

				drive.execute({
					selector: args.selector,
					execute: { action: 'pause', time: 350 }
				});

				/**
				 * Since our state has changed (because we've hovered over the original selector), check the asserts object
				 * for the hover action.
				 */

				testProperties(test);

				/**
				 * Push this test to the tests array for unit testing. I swear to god, we'll find a better way to do this.
				 */

				tests.push(test);

				break;

			case 'click':

				/**
				 * In our hover case, our test uses the original selector and original verification method. However,
				 * the assert mode and asserts object is overridden and the assert mode can be overridden, but has
				 * a smart default.
				 *
				 * @type {{selector: *, method: *, asserts: *, mode: array}}
				 */

				test = {
					selector: args.selector,
					method: args.method,
					asserts: testContainer.asserts,
					mode: testAssertMode
				};

				/**
				 * We're doing the click for them, so if the developer has specified an element to click "on", use that;
				 * otherwise, use the original selector. We're immediately going to follow that action with a pause action.
				 * We might make the pause time configurable in the future.
				 */

				drive.execute({
					selector: testContainer.on || args.selector,
					execute: { action: 'click' }
				});

				drive.execute({
					selector: testContainer.on || args.selector,
					execute: { action: 'pause', time: 150 }
				});

				/**
				 * Now that the state has changed with our pause action, verify the asserts object for the click action.
				 */

				testProperties(test);

				/**
				 * Push the test to our tests array for unit testing.
				 */

				tests.push(test);

				/**
				 * If the developer wants to click on another element to revert the state (like the background of a modal).
				 */

				if (testContainer.off) {

					/**
					 * Click on the "off" element and pause for 150 milliseconds.
					 */

					drive.execute({
						selector: testContainer.off,
						execute: { action: 'click' }
					});

					drive.execute({
						selector: testContainer.off,
						execute: { action: 'pause', time: 150 }
					});

					/**
					 * At this point, we're assuming that the developer was trying to get back to the original state of the
					 * selector, therefore we create a new test that uses the original state.
					 *
					 * @type {{selector: *, method: *, asserts: *, mode: *}}
					 */

					test = {
						selector: args.selector,
						method: args.method,
						asserts: args.asserts,
						mode: args.mode
					};

					/**
					 * Now that we've reverted the state, verify the original properties again.
					 */

					testProperties(test);

					/**
					 * Push the test to our tests array for unit testing.
					 */

					tests.push(test);

				}

				break;

			case 'move':

				/**
				 * In our move case, our test uses the original selector and original verification method. However,
				 * the assert mode and asserts object is overridden and the assert mode can be overridden, but has
				 * a smart default. This operates just like the hover event, but allows to to choose a different
				 * selector to move to. Hover assumes you're moving to the original selector.
				 *
				 * @type {{selector: *, method: *, asserts: *, mode: array}}
				 */

				test = {
					selector: args.selector,
					method: args.method,
					asserts: testContainer.asserts,
					mode: testAssertMode
				};

				/**
				 * We're performing the actions for the developer, so we're going to execute a hover action to a new
				 * selector or default to the original one, then we pause on that element for 350 milliseconds. We
				 * might consider making this optional in the future.
				 */

				drive.execute({
					selector: testContainer.to || args.selector,
					execute: { action: 'hover' }
				});

				drive.execute({
					selector: args.selector,
					execute: { action: 'pause', time: 350 }
				});

				/**
				 * Now that we've moved the mouse cursor, run the verifications against the move assert object.
				 */

				testProperties(test);

				/**
				 * Push the test to our tests array for unit testing.
				 */

				tests.push(test);

				break;
		}

	});

	/**
	 * Return the array in statements, which really only occur in unit testing. The module itself doesn't use
	 * statements when calling this function, so the return value will just dissipate in to nothing.
	 */

	return tests;

}

/**
 * We need to make sure that any value we get from Webdriver.io is parsed in to a value
 * that we expect.
 *
 * @param value
 * @param assertion
 * @returns {*}
 *
 */

function parseValue(value, assertion) {

	/**
	 * The default parsedValue is equal to whatever value we pass in to the function.
	 * This is usually the case when we have a number-number combination.
	 */

	var parsedValue = value;

	/**
	 * First, we check to see if the value we need verified AND the assertion we
	 * passed can be parsed as a number. If not, it's not a number-number combination
	 * and is probably something else, but we don't know what kind yet.
	 */

	if (!isNaN(parseFloat(assertion)) && !isNaN(parseFloat(value))) {

		/**
		 * So, now we're trying to see if we've encountered a string-string combination, like
		 * background-position: center center; if we have, then the return value should be
		 * like above, equal to whatever value we passed in.
		 */

		if (typeof value === 'string' && value.indexOf(' ') !== -1) {
			return parsedValue;
		}

		/**
		 * If the assertion value is modulated, then we have a string-number combination and can
		 * parse it as a integer or a float, though I don't think it really matters which one we
		 * use. I'm being overly cautious here.
		 */

		if (assertion % 1 === 0) {
			parsedValue = parseInt(value, 10);
		} else {
			parsedValue = parseFloat(value);
		}

	}

	/**
	 * At this point, we want to make sure the parsed value isn't a boolean, and if for some
	 * reason it is, make sure that we return a true boolean, not a string representation.
	 */

	parsedValue = (parsedValue === 'true') ? true : parsedValue;
	parsedValue = (parsedValue === 'false') ? false : parsedValue;

	/**
	 * Return the parsed value.
	 */

	return parsedValue

}

drive = {

	setup: function() {

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

		var url = argv(process.argv.slice(3)).url;
		var baseUrl;

		if ((typeof url !== 'undefined' && url !== '')) {
			baseUrl = url + '/'
		} else {
			baseUrl = 'http://localhost:3000/'
		}

		return baseUrl;

	},

	/**
	 * Our primary verify function.
	 * @param obj {object}
	 */

	verify: function(obj) {

		/**
		 * If there isn't a "steps" array, throw an error so the developer knows what's missing.
		 */

		if (!obj.steps) {
			throw new Error('Your verify object is missing a "steps" array.\n"steps": [\n  {\n    "selector": ".panel",\n    "verify": [\n      {\n        "method": "verifyCount",\n         "asserts": {\n           "count": 13\n        }\n      }\n    ]\n  }\n]');
		}

		var steps = obj.steps;

		/**
		 * Loops through all the steps of the object.
		 */

		steps.forEach(function(step, index) {

			/**
			 * If a selector isn't passed in the step, default to 'window'.
			 * @type {*|string}
			 */

			var selector = step.selector || 'window';

			/**
			 * Get all the action keys of a step. Can include 'selector, 'verify', and 'execute'. But only one
			 * of each key. We might try to figure out how to do that in the future, but in all honesty, that
			 * would change the definition of a single step.
			 *
			 * @type {Array}
			 */

			var actionKeys = Object.keys(steps[index]);

			/**
			 * Loop through the action keys and call the appropriate method (or nothing at all).
			 */

			actionKeys.forEach(function(key) {

				switch (key) {

					case 'verify':
						drive.verifyStep({ selector: selector, verify: steps[index].verify });
						break;
					case 'execute':
						drive.executeStep({ selector: selector, execute: steps[index].execute });
						break;
					default:
						return false;

				}

			});

		});

	},

	/**
	 * Our verifyStep() function takes a single step object and runs all the verification objects that
	 * may be inside. Returns an array for unit testing.
	 *
	 * @param args
	 * @returns {Array}
	 *
	 */

	verifyStep: function(args) {

		/**
		 * Our return object for unit testing. Doesn't get used during normal usage because this function is usually
		 * called as an expression, not a statement.
		 *
		 * @type {Array}
		 *
		 */

		var tests = [];

		/**
		 * Loop through all the objects of the verify array.
		 */

		args.verify.forEach(function(verification) {

			/**
			 * Get the proper assert mode array of the verification step.
			 * @type {array}
			 */

			var assertMode = getChaiAsserts(verification['assert-mode']);

			/**
			 * Build up our test object.
			 */

			var test = {
				selector: args.selector,
				method: verification.method,
				asserts: verification.asserts,
				mode: assertMode,
				actions: verification.then
			};

			/**
			 * If our verification step has browser-specific asserts objects, add them to
			 * the test object we just created.
			 */

			if (typeof verification['asserts-' + browserName] !== 'undefined') {
				test['asserts-' + browserName] = verification['asserts-' + browserName];
			}

			/**
			 * Pass the test to our testProperties() function.
			 */

			testProperties(test);

			/**
			 * If we have verification actions (encapsulated in our then: [] API), then pass
			 * the test to our fireEvents() function.
			 */

			if (verification.then && Array.isArray(verification.then)) {
				fireEvents(test);
			}

			/**
			 * Add this test object to our tests array, which we'll return for unit testing.
			 */

			tests.push(test);

		});

		/**
		 * Return our tests array.
		 */

		return tests;

	},

	/**
	 * Our executeStep() method takes a single step array and runs all the execute objects that might be inside.
	 *
	 * @param args
	 * @returns {Array}
	 *
	 */

	executeStep: function(args) {

		/**
		 * Keep a list of the actions that are called for unit testing.
		 * @type {Array}
		 */

		var actions = [];

		/**
		 * Loop through all the execute objects.
		 */

		args.execute.forEach(function(actionObj) {

			/**
			 * Build up the action.
			 */

			var action = {
				selector: args.selector,
				execute: actionObj
			};

			/**
			 * Pass our action to the drive.execute() method.
			 */

			drive.execute(action);

			/**
			 * Push our action to our actions array so we can keep track of it.
			 */

			actions.push(action);

		});

		/**
		 * Return the actions array for unit testing.
		 */

		return actions;

	},

	/**
	 * This function is basically how any action gets executed.
	 * @param args
	 */

	execute: function(args) {

		/**
		 * Check to see if we have a global action variable (from our datadriver reporter and ui),
		 * and if we do, use it and otherwise, use it.
		 */

		var execTest = (typeof action !== 'undefined') ? action : it;

		/**
		 * Other variables we're going to need.
		 */

		var actionMethod;
		var actionDescription;
		var actionArgs;
		var clickDesc;
		var tabList;

		/**
		 * Ok. Let's run our action through a switch.
		 */

		switch (args.execute.action) {

			case 'type':
			case 'setValue':

				actionMethod = 'setValue';
				actionDescription = 'executing "' + actionMethod + '" on "' + args.selector + '".';
				actionArgs = [args.selector, args.execute.text];

				break;

			case 'refresh':

				actionMethod = 'refresh';
				actionDescription = 'executing a browser ' + actionMethod + ' on the current page';
				actionArgs = [];

				break;

			case 'pause':

				var pauseSelector = args.selector ? args.selector : 'window';

				actionMethod = 'pause';
				actionDescription = 'pausing on "' + pauseSelector + '" for ' + args.execute.time + ' milliseconds.';
				actionArgs = [args.execute.time];

				break;

			case 'hover':
			case 'moveToObject':

				actionMethod = 'moveToObject';
				actionDescription = 'moving to the center of the "' + args.selector + '" element.';
				actionArgs = [args.selector, 5, 5];

				break;

			case 'click':

				actionMethod = 'click';
				actionDescription = 'clicking the "' + args.selector + '" element.';
				actionArgs = [args.selector];

				break;

			case 'redirect':
			case 'url':

				actionMethod = 'url';

				if (args.execute.page.indexOf('http://') === 0 || args.execute.page.indexOf('https://') === 0) {
					actionDescription = 'redirecting to "' + args.execute.page + '"';
					actionArgs = [args.execute.page];
				} else {
					actionDescription = 'redirecting to "' + drive.getBaseUrl() + args.execute.page + '"';
					actionArgs = [drive.getBaseUrl() + args.execute.page];
				}

				break;

			case 'setViewportSize':

				actionMethod = 'setViewportSize';
				actionDescription = 'giving the viewport a height of "' + args.execute.height + '" and a width of "' + args.execute.width + '"';
				actionArgs = [{ height: args.execute.height, width: args.execute.width }];

				break;

			case 'eval':
			case 'execute':

				actionMethod = 'execute';
				actionDescription = 'executing javascript: ' + args.execute.script;
				actionArgs = [args.execute.script];

				break;

			case 'evalAndStore':
			case 'executeAndStore':

				actionMethod = 'executeAndStore';
				actionDescription = 'executing javascript and storing the result in local storage.';
				actionArgs = [args.execute.script, args.execute.resultKey];

				break;

			case 'sendKeystroke':
			case 'keys':

				actionMethod = 'keys';
				actionDescription = 'sending keystroke(s) ' + args.execute.keystrokes;
				actionArgs = [args.execute.keystrokes];

				break;

			case 'buttonDown':

				clickDesc = getClickDescription(args.execute.button);

				actionMethod = 'buttonDown';
				actionDescription = 'pushing the ' + clickDesc + ' click down';
				actionArgs = [args.execute.button];

				break;

			case 'buttonUp':

				clickDesc = getClickDescription(args.execute.button);

				actionMethod = 'buttonUp';
				actionDescription = 'releasing the ' + clickDesc + ' click';
				actionArgs = [args.execute.button];

				break;

			case 'moveTo':

				actionMethod = 'moveTo';
				actionDescription = 'moving the ' + args.selector + ' element to new coordinates.';
				actionArgs = [null, args.execute.x, args.execute.y];

				break;

			case 'setCookie':

				actionMethod = 'setCookie';
				actionDescription = 'setting a cookie with name: "' + args.execute.name + '" and value: "' + args.execute.value + '"';
				actionArgs = [{name: args.execute.name, value: args.execute.value}];

				break;

			case 'deleteCookie':

				actionMethod = 'deleteCookie';

				if (args.execute.name) {
					actionDescription = 'deleting a cookie with name: "' + args.execute.name + '"';
					actionArgs = [args.execute.name];
				} else {
					actionDescription = 'deleting all the cookies';
					actionArgs = [];
				}

				break;

			case 'newWindow':

				actionMethod = 'newWindow';
				actionDescription = 'opening a new tab to the url: ' + args.execute.url;
				actionArgs = [args.execute.url];

				break;

			case 'switchTab':

				tabList = null;

				execTest('retrieving tab list', function(done) {

					browser
						.getTabIds()
						.then(function(data) {

							if (data) {

								tabList = data;

								browser
									.switchTab(tabList[args.execute.index])
									.then(function() {
										browser.call(done);
									});

							}

						});

				});

				actionMethod = 'log';
				actionDescription = 'current tab has been switched to tab index "' + args.execute.index + '"';
				actionArgs = ['browser'];

				break;

			case 'closeTab':

				tabList = null;

				execTest('retrieving tab list', function(done) {

					browser
						.getTabIds()
						.then(function(data) {

							if (data) {

								tabList = data;

								browser
								.close(tabList[args.execute.index])
								.then(function() {
									browser.call(done);
								});

							}

					});

				});

				actionMethod = 'log';
				actionDescription = 'Tab index "' + args.execute.index + '" has been closed.';
				actionArgs = ['browser'];

				break;
		}

		/**
		 * Once we have the action we want to execute, run it through the test harness.
		 * Congratulations to me. I learned how to finally use Function.prototype.apply().
		 */

		execTest(actionDescription, function(done) {

			var fn = browser[actionMethod];

			fn.apply(browser, actionArgs);

			browser.call(done);

		});

		/**
		 * This is only returned for unit testing. We'll get rid of this eventually.
		 */

		return {
			method: actionMethod,
			args: actionArgs,
			description: actionDescription
		};

	},

	/**
	 * Our verifyCssProperty method. It writes out the test and then runs it.
	 * @param args
	 */

	verifyCssProperty: function(args) {

		/**
		 * We keep this around for unit testing.
		 * @type {Array}
		 */

		var tests = [];

		/**
		 * Start the Mocha test for getCssProperty()
		 */

		it('the "' + args.assertKey + '" property of "' + args.selector + '" ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			/**
			 * Make the getCssProperty() call.
			 */

			browser.getCssProperty(args.selector, args.assertKey, function(err, data) {

				/**
				 * Var for the assertion we're going to create.
				 */

				var test;

				if (err) {

					/**
					 * Throw an error if there is one.
					 */

					throw new Error(err);

				} else {

					/**
					 * Populate our assertion data.
					 */

					test = {
						data: data,
						assert: args.assert,
						mode: args.mode
					};

					/**
					 * Call our private testProperty method where all the magic happens.
					 */

					testProperty(test);

					/**
					 * Push the assertion to our tests array for unit testing.
					 */

					tests.push(test);

				}

			});

			/**
			 * End the Mocha test.
			 */

			browser.call(done);

		});

		/**
		 * Return our tests array if someone asks for it.
		 */

		return tests;

	},

	/**
	 * With this method, we can verify a CSS property value against a value we've stored
	 * in local storage by specifying a key.
	 * @param args
	 * @returns {Array}
	 */

	verifyStoredCssProperty: function(args) {

		/**
		 * Keep track of the value retrieved from storage.
		 */

		var storedValue;

		/**
		 * Store the original assert key for use in our test description.
		 */

		var originalAssertKey = args.assert;

		/**
		 * If we have a custom reporter and UI, use them. Otherwise, use the default Mocha one.
		 */

		var execTest = (typeof action !== 'undefined') ? action : it;

		/**
		 * Keep track of our created assertions so that we can use them in unit testing.
		 * @type {Array}
		 */

		var tests = [];

		/**
		 * In order to verify properly, we're assuming that there is a value we want in local storage.
		 * We need to retrieve it, parse it and store it to a variable so that we can use it later.
		 */

		execTest('Retrieving values from local storage...', function(done) {

			browser.execute('return localStorage.getItem("' + args.assert + '");', null, function(err, data) {

				if (err) {
					throw new Error(err);
				} else {
					storedValue = (isNaN(parseFloat(data.value))) ? parseValue(data.value) : parseFloat(data.value);
				}

			});

			browser.call(done);

		});

		/**
		 * Once we have the value in local storage, we can write out test.
		 */

		it('the "' + args.assertKey + '" property of "' + args.selector + '" ' + getChaiAssertString(args.mode) + ' the local storage value in key "' + originalAssertKey + '"', function(done) {

			browser.getCssProperty(args.selector, args.assertKey, function(err, data) {

				if (err) {

					throw new Error(err);

				} else {

					/**
					 * Build the assertion, making sure we use the value from local storage as the assert value.
					 */

					var test = {
						data: data,
						assert: storedValue,
						mode: args.mode
					};

					/**
					 * Test the property using our private method build for that purpose.
					 */

					testProperty(test);

					/**
					 * Push the assertion to our tests array.
					 */

					tests.push(test);

				}

			});

			browser.call(done);

		});

		/**
		 * Return our tests array if a developer asks for it.
		 */

		return tests;

	},

	/**
	 * A verify method for checking the state of an element. Currently supports
	 * isExisting, isVisible, isEnabled, and isSelected.
	 *
	 * @param args
	 * @returns {Array}
	 */

	verifyState: function(args) {

		/**
		 * We use the methodVerb to modify our test description.
		 * The tests array will be the eventual return value for unit testing.
		 */

		var methodVerb;
		var tests = [];

		/**
		 * Depending on what the assert key is, modify the method verb appropriately.
		 */

		switch (args.assertKey) {
			case 'isExisting':
				methodVerb = (args.assert) ? 'exists' : 'does not exist';
				break;
			case 'isVisible':
				methodVerb = (args.assert) ? 'is visible' : 'is not visible';
				break;
			case 'isEnabled':
				methodVerb = (args.assert) ? 'is enabled' : 'is not enabled';
				break;
			case 'isSelected':
				methodVerb = (args.assert) ? 'is selected' : 'is not selected';
				break;
		}

		/**
		 * Run our test, making sure to push the assertion object to our tests array.
		 */

		it('the "' + args.selector + '" element ' + methodVerb + ' on the page', function(done) {

			browser[args.assertKey](args.selector, function(err, data) {

				if (err) {

					throw new Error(err);

				} else {

					var test = {
						data: data,
						assert: args.assert,
						mode: args.mode
					};

					testProperty(test);

					tests.push(test);

				}

			});

			browser.call(done);

		});

		/**
		 * Return our tests array if the developer asks for it.
		 */

		return tests;

	},

	/**
	 * A verification method for text.
	 *
	 * @param args
	 * @returns {Array}
	 */

	verifyText: function(args) {

		/**
		 * Keep track of the assertions for unit tests.
		 * @type {Array}
		 */

		var tests = [];

		/**
		 * Run the test.
		 */

		it('the "' + args.selector + '" element\'s text ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser.getText(args.selector, function(err, data) {

				if (err) {

					throw new Error(err);

				} else {

					var test = {
						data: data,
						assert: args.assert,
						mode: args.mode
					};

					testProperty(test);

					tests.push(test);

				}

			});

			browser.call(done);

		});

		/**
		 * Return our tests array if the developer asks for it.
		 */

		return tests;

	},

	/**
	 * Our method for verify HTML element attributes.
	 *
	 * @param args
	 * @returns {Array}
	 */

	verifyAttribute: function(args) {

		/**
		 * Keep track of our assertions for unit tests.
		 * @type {Array}
		 */

		var tests = [];

		it('the "' + args.assertKey + '" attribute of "' + args.selector + '" ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser.getAttribute(args.selector, args.assertKey, function(err, data) {

				if (err) {

					throw new Error(err);

				} else {

					var test = {
						data: data,
						assert: args.assert,
						mode: args.mode
					};

					/**
					 * So I'm not sure if we should be doing this. But I can't think of a better way to test for
					 * boolean attributes right now. Basically, if the attribute doesn't exist, we can verify it
					 * to be null and the test will pass.
					 */

					if (data !== null) {

						testProperty(test);

						tests.push(test);

					} else {

						test.assert = null;

						tests.push(test);

						return (data === null).should.be.true;

					}

				}

			});

			browser.call(done);

		});

		/**
		 * Return this array if the developer asks for it.
		 */

		return tests;

	},

	/**
	 * This method allows the developer to verify the url of the current page.
	 * @param args
	 * @returns {Array}
	 */

	verifyUrl: function(args) {

		/**
		 * Keep track of assertions for the unit tests.
		 * @type {Array}
		 */

		var tests = [];

		it('the "' + args.assertKey + '" of this page is ' + getChaiAssertString(args.mode) + ' "' + args.assert + '"', function(done) {

			browser.url(function(err, data) {

				if (err) {

					throw new Error(err);

				} else {

					var test = {
						data: data,
						assert: args.assert,
						mode: args.mode
					};

					testProperty(test);

					tests.push(test);

				}

			});

			browser.call(done);

		});

		/**
		 * Return this array if the developer asks for it.
		 */

		return tests;

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