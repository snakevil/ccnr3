const HtmlWebpackPlugin = require('html-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: __dirname + '/share/gui/app.ts',
    output: {
        filename: 'app.js',
        path: __dirname + '/var/gui'
    },
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js'
        ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "awesome-typescript-loader"
            },
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader"
            },
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.xslt$/,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]'
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'share/gui/index.html',
            inject: false
        }),
        new CopyWebpackPlugin([
            {
                from: '*.xslt',
                context: 'share/gui/'
            }
        ])
    ]
};
