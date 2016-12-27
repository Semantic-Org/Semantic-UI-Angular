var path = require('path');
var webpack = require('webpack');
var VERSION = require('./package.json').version;

var banner =
    '/*!\n' +
    ' * Semantic-UI AngularJS integration\n' +
    ' * https://github.com/semantic-org/semantic-ui-angular\n' +
    ' * @license MIT\n' +
    ' * v' + VERSION + '\n' +
    ' */\n';

module.exports = {
    context: path.resolve('src'),
    devtool: "source-map",
    entry: {
        'semantic-ui-angular': './index',
        'semantic-ui-angular.min': './index'
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js'
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //   include: /\.min\.js$/,
        //   minimize: true
        // }),
        //  new webpack.BannerPlugin(banner, {raw: true})
    ],
    module: {
        preLoaders: [
            { test: /\.ts$/, exclude: /node_modules/, loader: 'tslint-loader' },
            // TODO(m0t0r): JSCS complains on TS code, decide if we actually can/need make it work
            //{ test: /\.ts$/, exclude: /node_modules/, loader: 'jscs-loader' }
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
};