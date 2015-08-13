'use strict';

var drive = require('datadriver');

drive.executeAction({
  "execute": {
    "action": "redirect",
    "page": "http://google.com"
  }
});