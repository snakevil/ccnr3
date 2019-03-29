const gulp = require('gulp'),
    build = _ => gulp.src([
            'etc/**',
            'sbin/**',
            'share/**',
            '!share/gui/**',
            '!share/build/**'
        ], { base: '.' }).pipe(gulp.dest('var/build/')),
    watch = _ => gulp.watch([
            'etc/**',
            'sbin/**',
            'share/**',
            '!share/gui/**',
            '!share/build/**'
        ], build);

build.displayName =
watch.displayName = '(misc)';

module.exports = {
    build,
    watch
};
