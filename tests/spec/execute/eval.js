'use strict';

var drive = require('../../../lib/datadriver');

drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/eval.html"
	}
});

drive.execute({
  "execute": {
    "action": "eval",
    "script": "return 2 + 2;"
  }
});