'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    karma = require('karma');

var paths = {
  express: ['lib/**/*.js', 'models/**/!(index).js'],
  angular: ['js/**/*.js'],
  tests: {
    backend: ['test/server/**/*-spec.js']
  }
};

gulp.task('test:backend:pre', function() {
    return gulp.src(paths.express)
        .pipe(istanbul())
        .pipe(istanbul.hookRequire());
});

gulp.task('test:backend', ['test:backend:pre'], function() {
  return gulp.src(paths.tests.backend, { read: false })
    .pipe(mocha())
    .on('error', function() { this.emit('end'); })
    .pipe(istanbul.writeReports());
});

gulp.task('watch:test:backend', function() {
  gulp.run('test:backend');
  return gulp.watch(paths.express.concat(paths.tests.backend), ['test:backend']);
});

gulp.task('test:frontend', function(done) {
  new karma.Server({
    configFile: __dirname + '/test/karma.conf.js',
    singleRun: true
  }, done).start();
});

gulp.task('test', ['test:backend'], function() {
  process.exit();
});
gulp.task('default');
