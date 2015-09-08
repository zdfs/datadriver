'use strict';

var drive = require('../../../lib/datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/redirect.html"
	}
});

drive.execute({
  "execute": {
    "action": "redirect",
    "page": "http://google.com"
  }
});

drive.execute({
  "execute": {
    "action": "redirect",
    "page": "api/execute/redirect.html"
  }
});