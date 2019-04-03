const path = require('path'),
    webpack = require('webpack'),
    w_mce = require('mini-css-extract-plugin'),
    w_ugl = require('uglifyjs-webpack-plugin'),
    w_oca = require('optimize-css-assets-webpack-plugin'),
    w_cfg = {
        entry: path.resolve('share/gui/app.ts'),
        output: {
            filename: 'app.js',
            path: path.resolve('var/build/share/gui')
        },
        resolve: {
            extensions: [
                '.ts',
                '.tsx',
                '.js'
            ]
        },
        resolveLoader: {
            modules: [
                path.resolve('share/build'),
                'node_modules'
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
                        w_mce.loader,
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
                        'REPLACE',
                        'extract-loader',
                        'html-loader'
                    ]
                },
                {
                    test: /\.xslt$/,
                    use: [
                        'file-loader?name=[name].[ext]',
                        'REPLACE'
                    ]
                },
                {
                    test: /manifest\.webmanifest$/,
                    use: [
                        'file-loader?name=[name].[ext]',
                        'app-manifest-loader'
                    ]
                },
                {
                    test: /\/ccnr3\.png$/,
                    loader: 'sharp.loader'
                },
                {
                    test: /\.(eot|svg|ttf|woff)$/,
                    loader: 'file-loader?name=[name].[ext]'
                }
            ]
        },
        plugins: [
            new w_mce({
                filename: 'app.css'
            })
        ],
        externals: {
            react: 'React',
            'react-dom': 'ReactDOM'
        }
    },
    build = _ => {
        const config = Object.assign({}, w_cfg, {
            mode: 'production',
            devtool: 'hidden-source-map',
            optimization: {
                minimizer: [
                    new w_ugl({
                        cache: true,
                        parallel: true,
                        sourceMap: true
                    }),
                    new w_oca({})
                ]
            }
        });
        config.module.rules[3].use[1] =
        config.module.rules[4].use[1] = {
            loader: 'string-replace-loader',
            options: {
                search: '%REACT_PROFILE%',
                replace: 'production.min',
                flags: 'g'
            }
        };
        return new Promise((resolve, reject) => webpack(config, (err, stats) => {
            if (err)
                return reject(err);
            console.log(stats.toString());
            resolve();
        }));
    },
    watch = _ => {
        const config = Object.assign({}, w_cfg, {
            mode: 'development',
            devtool: 'eval-cheap-module-source-map'
        });
        config.output.pathinfo = true;
        config.module.rules[3].use[1] =
        config.module.rules[4].use[1] = {
            loader: 'string-replace-loader',
            options: {
                search: '%REACT_PROFILE%',
                replace: 'development',
                flags: 'g'
            }
        };
        return new Promise((resolve, reject) => webpack(config).watch({ ignored: /node_modules/ }, (err, stats) => {
            console.log(stats.toString());
        }));
    };

build.displayName =
watch.displayName = '(gui)';

module.exports = {
    build,
    watch
};
