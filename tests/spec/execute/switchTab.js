'use strict';

var drive = require('datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/switchTab.html"
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
    "action": "switchTab",
    "index": 1
  }
});

drive.execute({
  "execute": {
    "action": "switchTab",
    "index": 0
  }
});

drive.execute({
  "execute": {
    "action": "closeTab",
    "index": 1
  }
});