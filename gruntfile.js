var gruntConfig = {

	webdriver: {

		options: {

			desiredCapabilities: {
				browserName: 'chrome',
				name: 'Documentation Tests',
				viewports: {
					small: {
						width: 430,
						height: 1000
					},
					medium: {
						width: 700,
						height: 1000
					},
					large: {
						width: 1280,
						height: 1000
					},
					xlarge: {
						width: 1500,
						height: 1000
					},
					xxlarge: {
						width: 1950,
						height: 1000
					},
					weird: {
						width: 100,
						height: 100
					}
				}
			}

		},

		home: {
			tests: ['test/home/*.js']
		},

		browserstack: {

			options: {

				host: 'hub.browserstack.com',
				port: 80,
				user: 'zacharyforrest4',
				key: 'ZR7h2zB7UKo1RAasrUzt',

				desiredCapabilities: {
					browserName: 'chrome',
					name: 'Browserstack Tests',
					viewports: {
						small: {
							width: 430,
							height: 1000
						}
					}
				}

			},

			tests: ['test/home/*.js']

		},

		saucelabs: {

			options: {

				 host: 'ondemand.saucelabs.com',
				 port: 80,
				 user: 'zdfs',
				 key: '896a5f44-a86f-4909-bde4-b6e5ec584f00',
				 updateSauceJob: true,

				desiredCapabilities: {
					browserName: 'chrome',
					platform: 'OS X 10.10',
					version: '43.0',
					name: 'Saucelabs Tests',
					viewports: {
						small: {
							width: 430,
							height: 1000
						}
					}
				}

			},

			tests: ['test/home/*.js']

		}

	}

};

module.exports = function(grunt) {

	grunt.initConfig(gruntConfig);

	grunt.loadNpmTasks('grunt-webdriver');

};