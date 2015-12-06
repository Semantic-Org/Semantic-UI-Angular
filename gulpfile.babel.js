'use strict';

import gulp        from 'gulp';
import jshint      from 'gulp-jshint';
import runSequence from 'run-sequence';
import babel       from 'gulp-babel';
import del         from 'del';
import karma       from 'karma';
import Dgeni       from 'dgeni';
import es          from 'event-stream';
import plugins     from 'gulp-load-plugins';
import dgeniConfig from './docs/config/dgeni-config.js';

const paths = {
  jsSrc : 'src/**/*.js',
  semanticCss : 'node_modules/semantic-ui-css/**/*',
  semanticCssDocs : 'dist/docs/lib/semantic-ui-css',
  angularDocs : 'dist/docs/lib/angular',
  angularSrc : 'node_modules/angular/**/*',
  docsApp : 'docs/app/**/*',
  distApp : 'dist/docs/app'
};

gulp.task('jshint', function() {
  return gulp.src(paths.jsSrc)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('dgeni', function() {
  let dgeni = new Dgeni([ dgeniConfig ]);
  return dgeni.generate().catch(function(error) {
    console.error(error);
    process.exit(1);
  });
});

gulp.task('docs-assets', function() {
  let semanticAssets = gulp.src( paths.semanticCss )
    .pipe(gulp.dest( paths.semanticCssDocs ));

  let angularAssets = gulp.src( paths.angularSrc )
    .pipe(gulp.dest( paths.angularSrc ));

  let docsApp = gulp.src( paths.docsApp )
    .pipe(gulp.dest( paths.distApp ));

  return es.concat(docsApp, semanticAssets, angularAssets);
});

gulp.task('clean-build', function(done) {
  del(['./dist'], done);
});

gulp.task('test', ['jshint'], function(done) {
  karma.server.start({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: false,
    singleRun: true
  }, done);
});

gulp.task('test-dev', ['jshint'], function(done) {
  karma.server.start({
    configFile: __dirname + '/karma.conf.js',
    autoWatch: true,
    singleRun: false
  }, done);
});

gulp.task('docs', function(cb) {
  runSequence('clean-build', ['dgeni', 'docs-assets'], cb);
});

gulp.task('default', ['jshint'], function(cb) {
  runSequence(['jshint', 'docs'], cb);
});
