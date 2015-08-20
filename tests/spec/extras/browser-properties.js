'use strict';

var drive = require('datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/extras/browser-properties.html"
				}
			]
		},

		{
			"selector": "#button1",
			"verify": [
				{
					"method": "verifyCssProperty",
					"asserts": {
						"font-weight": "bold"
					},
					"asserts-firefox": {
						"font-weight": 700
					}
				}
			]
		}

  ]

});