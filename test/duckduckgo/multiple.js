'use strict';

var drive = require('datadriver');

drive.go({

  "config": {
    "description": "Duck Duck Go Tests",
    "url": "",
    "suites": [
      {
        "description": "Do the search and verify the logo",
        "tests": ["duck-duck-go-about"],
        "viewports": { small: true, medium: true }
      }
    ]
  },

  "duck-duck-go": {
    "steps": [
      {
        "selector": "#search_form_input_homepage",
        "execute": [{ "action": "type", "text": "Datadriver.io" }]
      },
      {
        "selector": "#search_button_homepage",
        "execute": [{ "action": "click" }],
      },
      {
        "verify": [
          {
            "method": "verifyPageTitle",
            "asserts": { "title": "Datadriver.io at DuckDuckGo" }
          }
        ]
      }
    ]
  },

  "duck-duck-go-about": {
    "steps": [
			{
			 "execute": [
				 {
					 "action": "redirect",
					 "page": "about"
				 }
			 ]
			},
      {
        "selector": ".timeline__logo",
        "verify": [
          {
            "method": "verifyAttribute",
            "asserts": {
              "src": drive.getBaseUrl() + "assets/dax-alt.svg"
            }
          }
        ]
      }
    ]
  }

});