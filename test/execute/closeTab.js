'use strict';

var drive = require('datadriver');


drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/closeTab.html"
	}
});

drive.execute({
  "execute": {
    "action": "newWindow",
    "url": "http://google.com"
  }
});

drive.execute({
  "execute": {
    "action": "closeTab",
    "focusIndex": 0
  }
});