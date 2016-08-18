/// <binding ProjectOpened='watch' />

var gulp = require('gulp');
var sass = require('gulp-sass');
var run = require('gulp-run');

var sassPath = ['app/**/*.scss'];

function reportChange(event) {
    console.log(event.type + ' : ' + event.path);
}

gulp.task('sass',
    function () {
        return gulp.src(sassPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app'));
    });

gulp.task('watch',
    function () {
        gulp.watch(sassPath, ['sass']).on('change', reportChange);
    });

gulp.task('livesync',
    function () {
        return run('tns livesync android --watch',
            {
                verbosity: 3
            })
            .exec()
            .pipe(gulp.dest('output'));
    });