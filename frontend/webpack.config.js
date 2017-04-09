var path = require('path');
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');
var autoprefixer = require('autoprefixer');

var NODE_ENV = process.env.NODE_ENV;
var ENTRY = process.env.ENTRY;

module.exports = {
    entry: ['babel-polyfill', ENTRY],
    output: {path: __dirname, filename: 'build/build.js', publicPath: '/'},
    plugins: NODE_ENV === 'production' ? [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('production')
                }
            }),
            new BundleTracker({filename: './build/webpack-stats.json'})
        ] : [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.optimize.AggressiveMergingPlugin(),
            new webpack.DefinePlugin({
                'process.env': {
                    'NODE_ENV': JSON.stringify('development')
                },
            }),
            new BundleTracker({filename: './build/webpack-stats.json'})
        ],
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015', 'react', 'stage-0'],
                    plugins: [
                        'transform-runtime',
                        'transform-decorators-legacy',
                        'transform-class-properties'
                    ]
                }
            },
            {test: /\.eot(\?v=\d+.\d+.\d+)?$/, loader: 'url?mimetype=application/vnd.ms-fontobject'},
            {test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url?mimetype=application/font-woff"},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?mimetype=application/octet-stream'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url?mimetype=image/svg+xml'},
            {test: /\.(jpe?g|png|gif)$/i, loader: 'file?name=[name].[ext]'},
            {test: /\.ico$/, loader: 'file?name=[name].[ext]'},
            {test: /(\.css|\.scss)$/, loaders: ['style-loader', 'css-loader?sourceMap', 'postcss-loader', 'sass-loader?sourceMap']}
        ]
    },
    postcss: () => [autoprefixer]
};
