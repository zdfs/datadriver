'use strict';

var drive = require('../../../lib/datadriver');

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