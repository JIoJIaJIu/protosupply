var gulp = require('gulp');
var spawn = require('child_process').spawn;

var cp = null;
gulp.task('default', function () {
        if (cp)
            cp.kill();

        cp = spawn('node', ['app.js'], {
            stdio: 'inherit',
            detached: true
        }); 
});

var files = [
    'config/**',
    'controllers/**',
    'models/**',
    'modules/**',
    'app.js',
    'route.json',
    'app.js'
]

gulp.task('watch', ['default'], function () {
    gulp.watch(files, ['default']);
});

process.on('SIGINT', function () {
    if (cp)
        cp.kill();
    process.exit(0);
});
