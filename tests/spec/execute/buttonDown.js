'use strict';

var drive = require('../../../lib/datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/buttonDown.html"
	}
});

drive.execute({
	"selector": "#button1",
	"execute": {
		"action": "buttonDown",
		"button": 0 // left click
	}
});

drive.execute({
	"selector": "#button1",
	"execute": {
		"action": "buttonDown",
		"button": 1 // middle click
	}
});

drive.execute({
	"selector": "#button1",
	"execute": {
		"action": "buttonDown",
		"button": 2 // right click
	}
});