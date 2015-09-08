/**
 * Import tape and rewire.
 */

var test = require('tape');
var rewire = require('rewire');

/**
 * Rewire our datadriver module.
 */

var drive = rewire('../../lib/datadriver');

/**
 * Run our tests.
 */

test('The getBaseUrl() method', function(t) {

	t.equal(drive.getBaseUrl(), 'http://localhost:3000/', 'The url should equal http://localhost:3000/ (with slash) without url option.');

	drive.__set__('process', {
		argv: ['', '', '', '--url=http://test.com']
	});

	t.equal(drive.getBaseUrl(), 'http://test.com/', 'The url should equal http://test.com/ (with slash) with url option.');
	t.end();

});