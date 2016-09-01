/// <binding ProjectOpened='watch' />

var gulp = require('gulp');
var sass = require('gulp-sass');
var run = require('gulp-run');
var jsonminify = require('gulp-jsonminify');

var sassPath = ['app/**/*.scss'];

var wineCriteriasPath = ['resources/wine-criterias.json'];
var wineCriteriasDestinationPath = 'app/data';

function reportChange(event) {
    console.log(event.type + ' : ' + event.path);
}

gulp.task('sass',
    function () {
        return gulp.src(sassPath)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('app'));
    });

gulp.task('wineCriterias',
    function() {
        return gulp.src(wineCriteriasPath)
        .pipe(jsonminify())
        .pipe(gulp.dest(wineCriteriasDestinationPath));
    });

gulp.task('watch',
    function () {
        gulp.watch(sassPath, ['sass']).on('change', reportChange);
        gulp.watch(wineCriteriasPath, ['wineCriterias']).on('change', reportChange);
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