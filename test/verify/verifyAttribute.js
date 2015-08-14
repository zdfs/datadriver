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

drive.verifyAttribute({
	selector: '#input1',
	assertKey: 'class',
	assert: 'test',
	mode: [ 'equal' ]
});

drive.verifyAttribute({
  selector: '#input1',
  assertKey: 'class',
  assert: 'error',
  mode: [ 'not', 'equal' ]
});