'use strict';

var drive = require('datadriver');

drive.go({

	"config": {
		"description": "Home page tests",
		"url": "",
		"suites": [
			{
				"description": "Verify lone paragraph",
				"tests": ["alone"],
				"viewports": { small: true }
			}
		]
	},

	"alone": {

		"steps": [

			{
				"selector": "p",
				"verify": [
					{
						"method": "verifyCount",
						"asserts": {
							"count": 1
						}
					}
				]
			}

		]

	}

});