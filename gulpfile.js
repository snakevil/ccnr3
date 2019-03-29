const gulp = require('gulp'),
    g_del = require('del'),
    g_fmt = require('format'),
    g_tar = require('gulp-tar'),
    g_zip = require('gulp-gzip'),
    {
        build: t_build_gui,
        watch: t_watch_gui
    } = require('./share/build/gui.task'),
    {
        build: t_build_app_lua,
        watch: t_watch_app_lua
    } = require('./share/build/app-lua.task'),
    {
        build: t_build_app_misc,
        watch: t_watch_app_misc
    } = require('./share/build/app-misc.task');

gulp.task('watch', gulp.parallel(gulp.series(t_watch_gui), t_watch_app_lua, t_watch_app_misc));

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
