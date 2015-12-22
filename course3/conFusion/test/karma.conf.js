module.exports = function(config) {
    config.set({
        basePath: '../',

        frameworks: ['jasmine'],

        files: [
            'bower_components/angular/angular.js',
            'bower_components/angular-resource/angular-resource.js',
            'bower_components/angular-ui-router/release/angular-ui-router.js',
            'bower_components/angular-mocks/angular-mocks.js',
            'app/scripts/*.js',
            'test/unit/**/*.js'
        ],

        exclude: [
            'test/protactor.conf.js', 'test/e2e/*.js'
        ],

        preprocessors: {

        },

        reporters: ['progress'],

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: true,

        browsers: ['Chrome', 'PhantomJS', 'PhantomJS_custom'],

        customLaunchers: {
            'PhantomJS_custom': {
                base: 'PhantomJS',
                options: {
                    windowName: 'my-window',
                    settings: {
                        webSecurityEnabled: false
                    }
                },
                flags: ['--load-images=true'],
                debug: true
            }
        },

        phantomJsLauncher: {
            exitOnResourceError: true
        },

        singleRun: false,

        concurrency: Infinity
    })
};
