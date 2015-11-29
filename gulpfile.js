var gulp = require('gulp');
var eslint = require('gulp-eslint');
var del = require('del');
var plugins = require('gulp-load-plugins')();
var karma = require('karma').server;
var Dgeni = require('dgeni');
var runSequence = require("run-sequence");
var es = require('event-stream');

gulp.task('eslint', function () {
  return gulp.src('src/**/*.js')
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('dgeni', function() {
  var dgeni = new Dgeni([require('./docs/config/dgeni-config.js')]);
  return dgeni.generate().catch(function(error) {
    console.error(error);
    process.exit(1);
  });
});

gulp.task('docs-assets', function() {
  var semanticAssets = gulp.src('node_modules/semantic-ui-css/**/*')
    .pipe(gulp.dest('dist/docs/lib/semantic-ui-css'));

  var angularAssets = gulp.src('node_modules/angular/**/*')
    .pipe(gulp.dest('dist/docs/lib/angular'));

  var docsApp = gulp.src('docs/app/**/*')
    .pipe(gulp.dest('dist/docs/app'));

  return es.concat(docsApp, semanticAssets, angularAssets);
});

gulp.task('clean-build', function(done) {
  del(['./dist'], done);
});

gulp.task('test', ['eslint'], function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: false,
    singleRun: true
  }, done);
});

gulp.task('test-dev', ['eslint'], function(done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: true,
    singleRun: false
  }, done);
});

gulp.task('docs', function(cb) {
  runSequence('clean-build', ['dgeni', 'docs-assets'], cb);
});

gulp.task('default', ['eslint'], function(cb) {
  runSequence(['eslint', 'docs'], cb);
});
