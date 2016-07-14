// var webpack = require('webpack');

module.exports = function (config) {
    config.set({
        basePath:   '',
        browsers:   ['Chrome'],
        // singleRun:  true,
        frameworks: ['mocha'],
        files:      ['test/webpack.tests.js'],
        reporters:  ['mocha'],
        preprocessors: {
            'test/webpack.tests.js': ['webpack', 'sourcemap']
        },
        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.js$/,
                        exclude: /node_modules/,
                        loader: 'babel',
                        query: {
                            presets: ['es2015', 'react']
                        }
                    }
                ]
           },
           externals: {
               'cheerio': 'window',
               'react/addons': true,
               'react/lib/ExecutionEnvironment': true,
               'react/lib/ReactContext': true
           },
        },
        webpackServer: {
            noInfo: true
        }
        // client: {
        //     mocha: {
        //         reporter: 'html'
        //     }
        // }
    });
};
