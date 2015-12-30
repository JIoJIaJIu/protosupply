var gulp = require('gulp');
var exec = require('child_process').exec;
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');

gulp.task('browserify', function () {
    var b = browserify({
        entries: ['src/app.js'],
        debug: true
    });

    b.transform(babelify)
     .bundle()
     .pipe(source('app.js'))
     .pipe(gulp.dest('static/js'))
});

gulp.task('default', ['deps', 'browserify']);

gulp.task('deps', function (cb) {
    exec('./node_modules/bower-installer/bower-installer.js', function () {
        cb();
    });
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/**', ['default']);
})
