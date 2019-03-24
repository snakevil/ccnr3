const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: __dirname + '/share/gui/js/index.tsx',
    output: {
        filename: 'app.js',
        path: __dirname + '/var/gui'
    },
    resolve: {
        extensions: [
            '.ts',
            '.tsx',
            '.js',
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
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'share/gui/index.html',
            inject: false
        })
    ]
};
