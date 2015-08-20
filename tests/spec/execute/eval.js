'use strict';

var drive = require('datadriver');


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