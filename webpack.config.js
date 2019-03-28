const MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    isDev = process.env.NODE_ENV === 'development',
    replace = {
        loader: 'string-replace-loader',
        options: {
            search: '%REACT_PROFILE%',
            replace: isDev ? 'development' : 'production.min',
            flags: 'g'
        }
    };

module.exports = {
    entry: __dirname + '/share/gui/app.ts',
    output: {
        filename: 'app.js',
        path: __dirname + '/var/build/share/gui'
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
                test: /\.scss$/,
                exclude: /node_modules/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            implementation: require('sass')
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                use: [
                    'file-loader?name=[name].[ext]',
                    replace,
                    'extract-loader',
                    'html-loader'
                ]
            },
            {
                test: /\.xslt$/,
                use: [
                    'file-loader?name=[name].[ext]',
                    replace
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'app.css'
        })
    ],
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM'
    }
};
