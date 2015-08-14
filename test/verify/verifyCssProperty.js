'use strict';

var drive = require('datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyCssProperty.html"
				}
			]
		},
		{
			"selector": "#button1",
			"verify": [
				{
					"method": "verifyCssProperty",
					"asserts": {
						"background-color": "rgba(213,72,90,1)",
						"border-top-left-radius": 3,
						"border-top-right-radius": 3,
						"border-bottom-right-radius": 3,
						"border-bottom-left-radius": 3,
						"color": "rgba(255,255,255,1)",
						"cursor": "pointer",
						"display": "inline-block",
						"padding-bottom": 12,
						"padding-top": 12,
						"padding-left": 16,
						"padding-right": 16
					},
					"then": [
						{
							"hover": {
								"asserts": {
									"background-color": "rgba(170,39,56,1)",
									"border-top-left-radius": 3,
									"border-top-right-radius": 3,
									"border-bottom-right-radius": 3,
									"border-bottom-left-radius": 3,
									"color": "rgba(255,255,255,1)",
									"cursor": "pointer",
									"display": "inline-block",
									"padding-bottom": 12,
									"padding-top": 12,
									"padding-left": 16,
									"padding-right": 16
								}
							}
						}
					]
				}
			]
		}

  ]

});

drive.verifyCssProperty({
  selector: '#button1',
  assertKey: 'background-color',
  assert: 'rgba(170,39,56,1)',
  mode: [ 'equal' ]
});

drive.verifyCssProperty({
  selector: '#button1',
  assertKey: 'border-top-left-radius',
  assert: '3',
  mode: [ 'be', 'at', 'least' ]
});