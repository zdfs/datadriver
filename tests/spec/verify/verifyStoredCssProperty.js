'use strict';

var drive = require('../../../lib/datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyStoredCssProperty.html"
				}
			]
		},

		{
			"selector": ".#column1",
			"execute": [
				{
					"action": "evalAndStore",
					"script": "return Math.round(parseInt(window.getComputedStyle(document.querySelector('#column1')).width, 10))",
					"resultKey": "column1-width"
				}
			]
		},

		{
			"selector": "#column2",
			"verify": [
				{
					"method": "verifyStoredCssProperty",
					"asserts": {
						"width": "column1-width"
					}
				}
			]
		},

		{
			"execute": [
				{
					"action": "setViewportSize",
					"height": 1000,
					"width": 400
				}
			]
		},

		{
			"selector": ".#column1",
			"execute": [
				{
					"action": "evalAndStore",
					"script": "return Math.round(parseInt(window.getComputedStyle(document.querySelector('#column1')).width, 10))",
					"resultKey": "column1-width"
				}
			]
		},

		{
			"selector": "#column2",
			"verify": [
				{
					"method": "verifyStoredCssProperty",
					"asserts": {
						"width": "column1-width"
					}
				}
			]
		}

  ]

});

drive.execute({
	"execute": {
		"action": "evalAndStore",
		"script": "return Math.round(parseInt(window.getComputedStyle(document.querySelector('#column1')).width, 10))",
		"resultKey": "column1-width"
	}
});

drive.verifyStoredCssProperty({
  selector: '#column2',
  assertKey: 'width',
  assert: 'column1-width',
  mode: [ 'equal' ]
});