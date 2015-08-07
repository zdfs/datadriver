var gruntConfig = {

	clean: {
		dev: ['public'],
		deploy: ['deploy']
	},

	concat: {

		dev: {
			src: [
				'node_modules/jquery/dist/jquery.js',
				'assets/scripts/vendor/modernizr.js',
				'assets/scripts/app/*.js'
			],
			dest: 'public/scripts/src/app.js'
		}

	},

	cssmin: {

		dev: {
			expand: true,
			cwd: 'public/styles/src',
			src: ['**/*.css'],
			dest: 'public/styles/min',
			ext: '.css'
		},

		deploy: {
			expand: true,
			cwd: 'deploy/styles/src',
			src: ['*.css'],
			dest: 'deploy/styles/min',
			ext: '.css'
		}

	},

	sass: {

		options: {
			quiet: true
		},

		dev: {

			files: [{
				expand: true,
				cwd: 'assets/styles/app',
				src: ['*.scss'],
				dest: 'public/styles/src',
				ext: '.css'
			}]

		},

		deploy: {

			files: [{
				expand: true,
				cwd: 'assets/styles/app',
				src: ['*.scss'],
				dest: 'deploy/styles/src',
				ext: '.css'
			}]

		}

	},

	uglify: {

		options: {
			mangle: {
				except: ['jQuery']
			}
		},

		dev: {
			files: {
				'public/scripts/min/app.js': ['public/scripts/src/app.js']
			}
		}

	},

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

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-webdriver');

	grunt.registerTask('build', [
		'clean:dev',
		'sass:dev',
		'concat:dev',
		'cssmin:dev',
		'uglify:dev'
	]);

};