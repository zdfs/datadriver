'use strict';

var drive = require('../../../lib/datadriver');

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