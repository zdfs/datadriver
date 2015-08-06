var drive = require('../lib/drive.js');

// TODO: I'd like to get this done automatically instead of having to call it.
drive.setup(browser, '../test/');

drive.go('home/index');