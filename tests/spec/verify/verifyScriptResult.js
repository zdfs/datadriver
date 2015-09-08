'use strict';

var drive = require('../../../lib/datadriver');

drive.verify({

	"steps": [

		{
			"execute": [
				{
					"action": "redirect",
					"page": "api/verify/verifyScriptResult.html"
				}
			]
		},
		{
			"selector": ".dropdown-menu",
			"verify": [
				{
					"method": "verifyCssProperty",
					"asserts": {
						"display": "none"
					}
				}
			]
		},
		{
			"selector": ".dropdown-button",
			"execute": [{ "action": "click" }]
		},
		{
			"selector": ".dropdown-menu",
			"verify": [
				{
					"method": "verifyCssProperty",
					"asserts": {
						"display": "block"
					}
				}
			]
		},
		{
			"selector": "return document.querySelector('.dropdown-button').offsetTop < document.querySelector('.dropdown-menu').offsetTop",
			"verify": [
				{
					"method": "verifyScriptResult",
					"asserts": {
						"result": true
					}
				}
			]
		},
		{
			"selector": ".dropdown-button",
			"execute": [{ "action": "click" }]
		},
		{
			"selector": ".dropdown-menu",
			"verify": [
				{
					"method": "verifyCssProperty",
					"asserts": {
						"display": "none"
					}
				}
			]
		}

	]

});

drive.execute({
	"selector": ".dropdown-button",
	"execute": { "action": "click" }
});

drive.verifyScriptResult({
	selector: 'return document.querySelector(\'.dropdown-button\').offsetTop < document.querySelector(\'.dropdown-menu\').offsetTop',
	assertKey: 'result',
	assert: true,
	mode: [ 'equal' ]
});