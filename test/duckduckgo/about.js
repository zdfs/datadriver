'use strict';

var drive = require('datadriver');

drive.go({

  "config": {
    "description": "Duck Duck Go Test",
    "url": "about",
    "suites": [
      {
        "description": "Verify DuckDuckGo logo",
        "tests": ["duck-duck-go-about"],
        "viewports": { large: true }
      }
    ]
  },

  "duck-duck-go-about": {
    "steps": [
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