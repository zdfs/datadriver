'use strict';

var drive = require('datadriver');


drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/setViewportSize.html"
	}
});

drive.execute({
  "execute": {
    "action": "setViewportSize",
    "height": 400,
    "width": 400
  }
});

drive.execute({
  "execute": {
    "action": "setViewportSize",
    "height": 1000,
    "width": 1200
  }
});