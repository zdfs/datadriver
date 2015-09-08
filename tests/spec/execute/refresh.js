'use strict';

var drive = require('../../../lib/datadriver');

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