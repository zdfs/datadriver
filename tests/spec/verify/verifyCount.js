'use strict';

var drive = require('datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyCount.html"
				}
			]
		},
		{
			"selector": "input.test",
			"verify": [
				{
					"method": "verifyCount",
					"asserts": {
						"count": 5
					}
				}
			]
		}

  ]

});

drive.verifyCount({
	selector: 'input.test',
	assertKey: 'count',
	assert: 5,
	mode: [ 'equal' ]
});