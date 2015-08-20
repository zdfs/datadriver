'use strict';

var drive = require('../../../lib/datadriver');

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyState.html"
				}
			]
		},
		{
			"selector": "#input1",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isEnabled": true
					}
				}
			]
		},
		{
			"selector": "#input2",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isEnabled": false
					}
				}
			]
		},
		{
			"selector": "#input3",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isEnabled": false
					}
				}
			]
		}

  ]

});

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyState.html"
				}
			]
		},
		{
			"selector": "#someNonExistingElement",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isExisting": false
					}
				}
			]
		},
		{
			"selector": "#notDisplayed",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isExisting": true
					}
				}
			]
		},
		{
			"selector": "#notVisible",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isExisting": true
					}
				}
			]
		},

		{
			"selector": "#notInViewport",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isExisting": true
					}
				}
			]
		},
		{
			"selector": "#zeroOpacity",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isExisting": true
					}
				}
			]
		}

  ]

});

drive.verify({

  "steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyState.html"
				}
			]
		},
		{
			"selector": "#select1 option:nth-of-type(1)",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isSelected": false
					}
				}
			]
		},
		{
			"selector": "#select1 option:nth-of-type(2)",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isSelected": true
					}
				}
			]
		},
		{
			"selector": "#select1 option:nth-of-type(3)",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isSelected": false
					}
				}
			]
		}

  ]

});

drive.verify({

	"steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyState.html"
				}
			]
		},
		{
			"selector": "#notDisplayed",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isVisible": false
					}
				}
			]
		},
		{
			"selector": "#notVisible",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isVisible": false
					}
				}
			]
		},

		{
			"selector": "#notInViewport",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isVisible": true
					}
				}
			]
		},
		{
			"selector": "#zeroOpacity",
			"verify": [
				{
					"method": "verifyState",
					"asserts": {
						"isVisible": false
					}
				}
			]
		}

	]

});

drive.verifyState({
	selector: '#zeroOpacity',
	assertKey: 'isVisible',
	assert: false,
	mode: [ 'equal' ]
});