'use strict';

var drive = require('datadriver');


drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/hover.html"
	}
});

drive.execute({
  "selector": "#button1",
  "execute": {
    "action": "hover"
  }
});