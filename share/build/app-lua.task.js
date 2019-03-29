const gulp = require('gulp'),
    g_lua = require('gulp-moonscript'),
    build = _ => gulp.src([
            'lib/**/*.moon',
            'libexec/*.moon'
        ], { base: '.' })
        .pipe(g_lua())
        .pipe(gulp.dest('var/build/')),
    watch = _ => gulp.watch([
            'lib/**/*.moon',
            'libexec/*.moon'
        ], build);

build.displayName =
watch.displayName = '(lua)';

module.exports = {
    build,
    watch
};
