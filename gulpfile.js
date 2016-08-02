/// <binding ProjectOpened='default' />

var gulp = require('gulp');
var sass = require('gulp-sass');

var sassPath = ['app/**/*.scss'];

function reportChange(event) {
    console.log(event.type + ' : ' + event.path);
}

gulp.task('sass', function(){
	return gulp.src(sassPath)
	.pipe(sass().on('error', sass.logError))
	.pipe(gulp.dest('app'));
});

gulp.task('default', function(){
	gulp.watch(sassPath, ['sass']).on('change', reportChange);
});