'use strict';

var drive = require('datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/type.html"
	}
});

drive.execute({
  "selector": "#text1",
  "execute": {
    "action": "type",
    "text": "hello, world"
  }
});