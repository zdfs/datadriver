'use strict';

var drive = require('datadriver');


drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/pause.html"
	}
});

drive.execute({
  "execute": {
    "action": "pause",
    "time": 5000
  }
});