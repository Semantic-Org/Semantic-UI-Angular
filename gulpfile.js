var gulp = require('gulp');
var jshint = require('gulp-jshint');
var plugins = require('gulp-load-plugins')();

gulp.task('jshint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('default', ['jshint'], function() {

});
