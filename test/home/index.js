'use strict';

var drive = require('datadriver');

drive.go({

	"config": {
		"description": "Duck Duck Go Test",
		"url": "",
		"suites": [
			{
				"description": "Search for DataDriver.io",
				"tests": ["duck-duck-go"],
				"viewports": { small: true }
			}
		]
	},

	"duck-duck-go": {

		"steps": [

			{
				"selector": "#search_form_input_homepage",
				"execute": [
					{
						"action": "type",
						"text": "Datadriver.io"
					}
				]
			},

			{
				"selector": "#search_button_homepage",
				"execute": [
					{
						"action": "click"
					}
				],
				"verify": [
					{
						"method": "verifyPageTitle",
						"asserts": {
							"title": "Datadriver.io at DuckDuckGo"
						}
					}
				]
			}

		]

	}

});