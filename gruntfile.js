var gruntConfig = {

	webdriver: {

		options: {

			// For SauceLabs
			// ================================
			// host: 'ondemand.saucelabs.com',
			// port: 80,
			// user: 'zdfs',
			// key: '896a5f44-a86f-4909-bde4-b6e5ec584f00',
			// updateSauceJob: true

			// For BrowserStack
			// ================================
			// host: 'hub.browserstack.com',
			// port: 80,
			// user: 'zacharyforrest4',
			// key: 'ZR7h2zB7UKo1RAasrUzt'

			desiredCapabilities: {
				browserName: 'chrome',
				browserKey: 'chrome', // Let's see if we can remove this.
				name: 'Documentation Tests'
			}

		},

		home: {
			tests: ['test/home/*.js']
		}

	}

};

module.exports = function(grunt) {

	grunt.initConfig(gruntConfig);

	grunt.loadNpmTasks('grunt-webdriver');

};