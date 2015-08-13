var Mocha = require('grunt-webdriver/node_modules/mocha'),
		Suite = require('grunt-webdriver/node_modules/mocha/lib/suite'),
		Test = require('grunt-webdriver/node_modules/mocha/lib/test'),
		escapeRe = require('grunt-webdriver/node_modules/mocha/node_modules/escape-string-regexp'),
		commonUI = require('grunt-webdriver/node_modules/mocha/lib/interfaces/common');

module.exports = Mocha.interfaces['ddui'] = function(suite) {

	var suites = [suite];

	suite.on('pre-require', function(context, file, mocha) {

		var common = commonUI(suites, context);

		context.before = common.before;
		context.after = common.after;
		context.beforeEach = common.beforeEach;
		context.afterEach = common.afterEach;
		context.run = mocha.options.delay && common.runWithSuite(suite);

		/**
		 * Describe a "suite" with the given `title`
		 * and callback `fn` containing nested suites
		 * and/or tests.
		 */

		context.describe = context.context = function(title, fn) {
			var suite = Suite.create(suites[0], title);
			suite.file = file;
			suites.unshift(suite);
			fn.call(suite);
			suites.shift();
			return suite;
		};

		/**
		 * Pending describe.
		 */

		context.xdescribe = context.xcontext = context.describe.skip = function(title, fn) {
			var suite = Suite.create(suites[0], title);
			suite.pending = true;
			suites.unshift(suite);
			fn.call(suite);
			suites.shift();
		};

		/**
		 * Exclusive suite.
		 */

		context.describe.only = function(title, fn) {
			var suite = context.describe(title, fn);
			mocha.grep(suite.fullTitle());
			return suite;
		};

		/**
		 * Describe a specification or test-case
		 * with the given `title` and callback `fn`
		 * acting as a thunk.
		 */

		context.it = context.specify = function(title, fn) {
			var suite = suites[0];
			if (suite.pending) {
				fn = null;
			}
			var test = new Test(title, fn);
			test.file = file;
			suite.addTest(test);
			return test;
		};


		/**
		 * Our addition. A comment function that creates a pending test and
		 * adds an isComment attribute to the test for identification by a
		 * third party, custom reporter. The comment will be printed just like
		 * a pending test. But any custom reporter could check for the isComment
		 * attribute on a test to modify its presentation.
		 */
		context.action = function(title, fn) {

			var suite = suites[0],
				action;

			action = new Test(title, fn);
			action.file = file;
			action.isAction = true;
			suite.addTest(action);

			return action;

		};

		/**
		 * Exclusive test-case.
		 */

		context.it.only = function(title, fn) {
			var test = context.it(title, fn);
			var reString = '^' + escapeRe(test.fullTitle()) + '$';
			mocha.grep(new RegExp(reString));
			return test;
		};

		/**
		 * Pending test case.
		 */

		context.xit = context.xspecify = context.it.skip = function(title) {
			context.it(title);
		};

	});

};