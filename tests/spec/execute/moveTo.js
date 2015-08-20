'use strict';

var drive = require('../../../lib/datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/moveTo.html"
	}
});

drive.execute({
  "selector": "#button1",
  "execute": {
    "action": "moveTo",
    "x": 100,
    "y": 0
  }
});