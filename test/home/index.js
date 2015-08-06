'use strict';

module.exports = {

	"config": {
		"description": "Home page tests",
		"url": "",
		"suites": [
			{
				"description": "Verify lone paragraph",
				"tests": ["alone"],
				"viewports": { "large": true }
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

};