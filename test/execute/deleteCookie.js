'use strict';

var drive = require('datadriver');


drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/deleteCookie.html"
	}
});

drive.execute({
  "execute": {
    "action": "deleteCookie",
    "name": "docCookie"
  }
});