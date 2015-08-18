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
					}
				}
			}
		},
		home: {
			tests: ['tests/*.js']
		}
	}
};

module.exports = function(grunt) {
	grunt.initConfig(gruntConfig);
	grunt.loadNpmTasks('grunt-webdriver');
};