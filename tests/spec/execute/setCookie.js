'use strict';

var drive = require('../../../lib/datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/setCookie.html"
	}
});

drive.execute({
  "execute": {
    "action": "setCookie",
    "name": "docCookie",
    "value": "true"
  }
});