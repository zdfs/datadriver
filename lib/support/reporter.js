/**
 * Module dependencies.
 */

var Base = require('grunt-webdriver/node_modules/mocha/lib/reporters/base')
	, cursor = Base.cursor
	, color = Base.color;

require('./ui');

/**
 * Expose `Spec`.
 */

exports = module.exports = ddReporter;

/**
 * Initialize a new `ddReporter` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function ddReporter(runner) {

	Base.call(this, runner);

	var self = this
		, stats = this.stats
		, indents = 0
		, n = 0;

	function indent() {
		return Array(indents).join('  ')
	}

	runner.on('start', function() {
		console.log();
	});

	runner.on('suite', function(suite) {
		++indents;
		console.log(color('suite', '%s%s'), indent(), suite.title);
	});

	runner.on('suite end', function(suite) {
		--indents;
		if (1 == indents) console.log();
	});

	runner.on('pending', function(test) {
		var fmt = indent() + color('pending', '  - %s');
		console.log(fmt, test.title);
	});

	runner.on('pass', function(test) {

		if (test.isAction) {
			var fmt = indent()
				+ color('pending', '  ⚙ %s');
			cursor.CR();
			self.stats.passes--;
			console.log(fmt, test.title);
		} else if ('fast' == test.speed) {
			var fmt = indent()
				+ color('checkmark', '  ' + Base.symbols.ok)
				+ color('pass', ' %s');
			cursor.CR();
			console.log(fmt, test.title);
		} else {
			var fmt = indent()
				+ color('checkmark', '  ' + Base.symbols.ok)
				+ color('pass', ' %s')
				+ color(test.speed, ' (%dms)');
			cursor.CR();
			console.log(fmt, test.title, test.duration);
		}
	});

	runner.on('fail', function(test, err) {
		cursor.CR();
		console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
	});

	runner.on('end', self.epilogue.bind(self));
}

/**
 * Inherit from `Base.prototype`.
 */

ddReporter.prototype.__proto__ = Base.prototype;