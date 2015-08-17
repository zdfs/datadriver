'use strict';

var drive = require('datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyText.html"
				}
			]
		},
		{
			"selector": "#poem",
			"verify": [
				{
					"method": "verifyText",
					"asserts": {
						"text": "Our Father who art in heaven, I am drunk.\nAgain. Red wine. For which I offer thanks."
					}
				}
			]
		}

  ]

});

drive.verifyText({
	selector: '#poem',
	assertKey: 'text',
	assert: 'Our Father who art in heaven, I am drunk.\nAgain. Red wine. For which I offer thanks.',
	mode: [ 'equal' ]
});