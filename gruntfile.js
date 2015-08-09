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
				'public/images/icons/grunticon.loader.js',
				'assets/scripts/app/grunticon.js',
				'assets/scripts/app/main-nav.js'
			],
			dest: 'public/scripts/src/app.js'
		}

	},

	concurrent: {
		dev: ['express', 'watch']
	},

	copy: {

		images: {
			expand: true,
			cwd: 'assets/images',
			src: '**',
			dest: 'public/images'
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

	express: {

		dev: {

			options: {
				script: 'server.js'
			}

		}

	},

	grunticon: {

		options: {
			enhanceSVG: true
		},

		icons: {
			files: [{
				expand: true,
				cwd: 'assets/svgs',
				src: ['*.svg'],
				dest: 'public/images/icons'
			}]
		}

	},

	jade: {

		options: {
			pretty: true,
			data: {
				path: 'public/'
			}
		},

		deploy: {
			expand: true,
			cwd: 'views',
			src: ['**/*.jade', '!**/layouts/**', '!**/mixins/**', '!**/common/**'],
			dest: '',
			ext: '.html'
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

	watch: {

		express: {
			files: ['views/**/*.jade'],
			options: {
				livereload: true
			}
		},

		sass: {
			files: ['assets/styles/app/*.scss', 'assets/styles/refills/*.scss'],
			tasks: ['sass:dev', 'concat:dev', 'cssmin:dev']
		},

		scripts: {
			files: ['assets/scripts/app/*.js'],
			tasks: [
				'concat:dev',
				'uglify:dev'
			]
		},

		livereload: {
			options: {
				livereload: true
			},
			files: [
				'public/styles/**/*.css',
				'public/scripts/**/*.js'
			]
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
						width: 400,
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

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-grunticon');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-webdriver');

	grunt.registerTask('build', [
		'clean:dev',
		'sass:dev',
		'grunticon:icons',
		'copy:images',
		'concat:dev',
		'cssmin:dev',
		'uglify:dev'
	]);

	grunt.registerTask('html', [
		'build',
		'jade'
	]);

	grunt.registerTask('default', ['concurrent:dev']);

};