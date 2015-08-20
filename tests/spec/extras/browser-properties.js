'use strict';

var drive = require('../../../lib/datadriver');

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