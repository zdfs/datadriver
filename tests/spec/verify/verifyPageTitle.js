'use strict';

var drive = require('datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyPageTitle.html"
				}
			]
		},
		{
			"verify": [
				{
					"method": "verifyPageTitle",
					"asserts": {
						"title": "Datadriver"
					}
				}
			]
		}

  ]

});

drive.verifyPageTitle({
	selector: 'window',
	assertKey: 'title',
	assert: "Datadriver",
	mode: [ 'equal' ]
});