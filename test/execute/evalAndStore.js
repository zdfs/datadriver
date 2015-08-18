'use strict';

var drive = require('datadriver');


drive.execute({
	"execute": {
		"action": "redirect",
		"page": "api/execute/evalAndStore.html"
	}
});

drive.execute({
  "execute": {
    "action": "evalAndStore",
    "script": "return 2 + 2;",
    "resultKey": "sumUp"
  }
});