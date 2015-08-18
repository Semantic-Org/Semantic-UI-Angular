'use strict';

var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var plugins = require('gulp-load-plugins')();
var src = [
  'src/sm-core.js',
  'src/sm-addons.js',
  'src/*/*.js'
];

gulp.task('build', function () {
  return gulp
    .src( src )
    .pipe( plugins.concat('angular-semantic-ui.js') )
    .pipe( gulp.dest('.') );
});

gulp.task('build-min', function () {
  return gulp
    .src( src )
    .pipe( sourcemaps.init() )
      .pipe( plugins.concat('angular-semantic-ui.min.js') )
      .pipe( plugins.uglify({mangle:false}) )
    .pipe( sourcemaps.write('.') )
    .pipe( gulp.dest('.') );
});

gulp.task('default', ['build', 'build-min']);
