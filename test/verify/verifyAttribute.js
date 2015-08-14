'use strict';

var drive = require('datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyAttribute.html"
				}
			]
		},
		{
			"selector": "#input1",
			"verify": [
				{
					"method": "verifyAttribute",
					"asserts": {
						"disabled": null,
						"required": true,
						"data-type": "test",
						"class": "test",
						"type": "text"
					}
				}
			]
		}

  ]

});