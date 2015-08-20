'use strict';

var drive = require('../../../lib/datadriver');

drive.verify({

  "steps": [

		// We're not certain that we'll be on the correct page
		// when we execute this step, so let's make sure we're
		// where we need to be.

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/methods/verify.html"
				}
			]
		},

		// Let's grab the first link in the sidebar, verify the color
		// is correct, then hover over it and verify the color
		// changes to something we expect. After we're done verifying
		// the link colors, let's click the link with an execute action.

		{
			"selector": "a[href*=\"api/methods/execute.html\"]",
			"verify": [
				{
					"method": "verifyCssProperty",
					"asserts": {
						"color": "rgba(213,72,90,1)"
					},
					"then": [
						{
							"hover": {
								"asserts": {
									"color": "rgba(170,39,56,1)"
								}
							}
						}
					]
				}
			],
			"execute": [
				{ "action": "click" }
			]
		},

		// With this new step, we're going to verify the url is actually
		// the execute() documentation page.

		{
			"verify": [
				{
					"method": "verifyUrl",
					"asserts": {
						"url": drive.getBaseUrl() + "api/methods/execute.html"
					}
				}
			]
		}

  ]

});