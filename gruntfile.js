var gruntConfig = {

	webdriver: {

		options: {

			browserstack: {
				user: 'zacharyforrest4',
				key: 'ZR7h2zB7UKo1RAasrUzt'
			},

			saucelabs: {
				user: 'zdfs',
				key: '896a5f44-a86f-4909-bde4-b6e5ec584f00',
				updateSauceJob: true
			},

			desiredCapabilities: {
				browserName: 'chrome',
				browserKey: 'chrome'
			},

			name: "Documentation Tests"

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