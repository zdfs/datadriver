'use strict';

var drive = require('datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/buttonUp.html"
	}
});


drive.execute({
	"selector": "#button1",
	"execute": {
		"action": "buttonUp",
		"button": 0 // left click
	}
});

drive.execute({
	"selector": "#button1",
	"execute": {
		"action": "buttonUp",
		"button": 1 // middle click
	}
});

drive.execute({
	"selector": "#button1",
	"execute": {
		"action": "buttonUp",
		"button": 2 // right click
	}
});