'use strict';

var drive = require('../../../lib/datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/click.html"
	}
});

drive.execute({
  "selector": "#button1",
  "execute": {
    "action": "click"
  }
});