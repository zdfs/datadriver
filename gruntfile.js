var gruntConfig = {
  datadriver: {
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
      },
      reporter: require('./lib/support/reporter'),
      ui: 'ddui'
    },
    spec: {
      tests: ['tests/spec/**/*.js']
    }
  }
};

module.exports = function(grunt) {
  grunt.initConfig(gruntConfig);
  grunt.loadNpmTasks('grunt-datadriver');
};