'use strict';

var drive = require('datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/sendKeystroke.html"
	}
});

drive.execute({
  "selector": "#text1",
  "execute": {
    "action": "type",
    "text": "test"
  }
});

drive.execute({
  "selector": "#text1",
  "execute": {
    "action": "sendKeystroke",
    "keystrokes": "Equals"
  }
});