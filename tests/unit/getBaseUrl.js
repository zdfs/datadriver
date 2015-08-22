var test = require('tape');
var drive = require('../../lib/datadriver');

test('The getBaseUrl() method', function(t) {

 	var baseUrl;

 	process.argv.push("--url=http://test.com");

	baseUrl = drive.getBaseUrl();

	t.equal(baseUrl, "http://test.com/", 'The url should equal http://test.com/ (with slash) with url option.');

	process.argv.pop();

	baseUrl = drive.getBaseUrl();

	t.equal(baseUrl, "http://localhost:3000/", 'The url should equal http://localhost:3000/ (with slash) without url option.');

	t.end();

});