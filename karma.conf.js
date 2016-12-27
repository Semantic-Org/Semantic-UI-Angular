module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            './node_modules/jquery/dist/jquery.js',
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            './node_modules/angular/angular.js',
            './node_modules/angular-mocks/angular-mocks.js',
            { pattern: 'spec.bundle.js', watched: false }
        ],


        // list of files to exclude
        exclude: [],

        plugins: [
            require("karma-phantomjs-launcher"),
            require("karma-sourcemap-loader"),
            require('karma-jasmine'),
            require('karma-webpack')
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'spec.bundle.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtools: 'inline-source-map',
            module: {
                preLoaders: [
                    { test: /\.ts$/, exclude: /node_modules/, loader: 'tslint-loader' }
                ],
                loaders: [
                    { test: /\.ts?$/, exclude: /node_modules/, loader: 'ts-loader' },
                    { test: /\.json?$/, exclude: /node_modules/, loader: 'json-loader' }
                ]
            },
            tslint: {
                configuration: require('./tslint.json')
            },
            resolve: {
                extensions: ['', '.ts', '.js']
            }
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


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
        browsers: ['PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};