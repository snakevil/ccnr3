const gulp = require('gulp'),
    webpack = require('webpack'),
    w_mce = require('mini-css-extract-plugin'),
    w_ugl = require('uglifyjs-webpack-plugin'),
    w_oca = require('optimize-css-assets-webpack-plugin'),
    g_lua = require('gulp-moonscript'),
    g_del = require('del'),
    g_fmt = require('format'),
    g_tar = require('gulp-tar'),
    g_zip = require('gulp-gzip'),
    w_cfg = {
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
                    test: /\.png$/,
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
    t_build_gui = _ => {
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
    t_watch_gui = _ => {
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
    },
    t_build_app_lua = _ => gulp.src([
            'lib/**/*.moon',
            'libexec/*.moon'
        ], { base: '.' })
        .pipe(g_lua())
        .pipe(gulp.dest('var/build/')),
    t_build_app_misc = _ => gulp.src([
            'etc/**',
            'sbin/**',
            'share/**',
            '!share/gui/**'
        ], { base: '.' }).pipe(gulp.dest('var/build/')),
    t_watch_app_lua = _ => gulp.watch([
            'lib/**/*.moon',
            'libexec/*.moon'
        ], t_build_app_lua),
    t_watch_app_misc = _ => gulp.watch([
            'etc/**',
            'sbin/**',
            'share/**',
            '!share/gui/**'
        ], t_build_app_misc);

t_watch_gui.displayName = '(gui)';
t_watch_app_lua.displayName = '(lua)';
t_watch_app_misc.displayName = '(conf)';

gulp.task('watch', gulp.parallel(gulp.series(t_watch_gui), t_watch_app_lua, t_watch_app_misc));

t_build_gui.displayName = '(gui)';
t_build_app_lua.displayName = '(lua)';
t_build_app_misc.displayName = '(conf)';

gulp.task('gui', gulp.series(t_build_gui));
gulp.task('app', gulp.parallel(t_build_app_lua, t_build_app_misc));

gulp.task('clean', async _ => await g_del([
    'var/build/etc',
    'var/build/lib',
    'var/build/libexec',
    'var/build/sbin',
    'var/build/share'
]));

gulp.task('build', gulp.parallel('gui', 'app'));

gulp.task('dist', _ => {
    const now = new Date();
    return gulp.src('var/build/**', { base: 'var/build' })
        .pipe(g_tar(g_fmt(
            'ccnr3-%4d%02d%02d-%02d%02d.tar',
            now.getFullYear(),
            1 + now.getMonth(),
            now.getDate(),
            now.getHours(),
            now.getMinutes()
        ))).pipe(g_zip())
        .pipe(gulp.dest('.'));
});

gulp.task('default', gulp.series('clean', 'build', 'dist'));
