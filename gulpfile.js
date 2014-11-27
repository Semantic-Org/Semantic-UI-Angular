var gulp = require('gulp');
var jshint = require('gulp-jshint');
var plugins = require('gulp-load-plugins')();
var karma = require('karma').server;

gulp.task('jshint', function() {
  return gulp.src('src/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('test', ['jshint'], function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: false,
    singleRun: true
  }, done);
});

gulp.task('test-dev', ['jshint'], function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: true,
    singleRun: false
  }, done);
});

gulp.task('default', ['jshint'], function() {

});
