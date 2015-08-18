'use strict';

var drive = require('datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/refresh.html"
	}
});

drive.execute({
  "execute": {
    "action": "refresh"
  }
});