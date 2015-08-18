'use strict';

var drive = require('datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/extras/assert-modes.html"
				}
			]
		},

		{
			"selector": ".grid--third",
			"verify": [
				{
					"method": "verifyCount",
					"assert-mode": "be above",
					"asserts": {
						"count": 2
					}
				}
			]
		}

  ]

});