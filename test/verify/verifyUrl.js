'use strict';

var drive = require('datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyUrl.html"
				}
			]
		},
		{
			"verify": [
				{
					"method": "verifyUrl",
					"asserts": {
						"url": drive.getBaseUrl() + "api/verify/verifyUrl.html"
					}
				}
			]
		}

  ]

});

drive.verifyUrl({
	selector: 'window',
	assertKey: 'url',
	assert: drive.getBaseUrl() + "api/verify/verifyUrl.html",
	mode: [ 'equal' ]
});