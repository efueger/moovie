/* eslint-env node */
module.exports = function (config) {
    config.set({
        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '../',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'browserify', 'detectBrowsers'],

        // list of files / patterns to load in the browser
        files: [
            'bower_components/mootools/dist/mootools-core.min.js',
            'tests/**/*.js'
        ],

        // list of files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'tests/**/*.js': ['browserify']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: false,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: [],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,

        client: {
            mocha: {
                // I'm using Jasmine-style matchers here.
                // I don't mind chaining, but I think at a certain
                // point it becomes a bit too much (looking at you Chai).
                require: [require.resolve('expectations')],
                ui: 'bdd'
            }
        },

        detectBrowsers: {
            // phantomjs does not support the <video> element
            usePhantomJS: false,

            postDetection: function (availableBrowsers) {
                const result = availableBrowsers;

                // There seems to be a problem with Chrome and Travis...
                if (process.env.TRAVIS) {
                    if (availableBrowsers.indexOf('Chrome') > -1) {
                        result.splice(result.indexOf('Chrome'), 1);
                    }
                }

                return result;
            }
        },

        browserify: {
            debug: true,
            transform: [
                require('browserify-istanbul')({
                    instrumenter: require('isparta'),
                    instrumenterConfig: {
                        embedSource: true
                    }
                })
            ]
        },

        coverageReporter: {
            dir: 'coverage',
            reporters: [
                {
                    type: 'html',
                    subdir: function (browser) {
                        return browser.toLowerCase().split(/[ /-]/)[0];
                    }
                }
            ]
        }
    });
};
