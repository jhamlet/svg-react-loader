module.exports = {
    entry: './test/build.js',
    output: {
        path: './',
        filename: 'build.js'
    },

    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
            { test: /\.svg$/, loader: 'babel!svg-react?reactDOM=react' }
        ]
    },

    devServer: {
        contentBase: './'
    }
};
