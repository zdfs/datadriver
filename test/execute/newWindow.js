'use strict';

var drive = require('datadriver');


drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/newWindow.html"
	}
});

drive.execute({
  "execute": {
    "action": "newWindow",
    "url": "http://google.com"
  }
});