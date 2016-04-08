'use strict';

var gulp = require('gulp'),
    mocha = require('gulp-mocha'),
    istanbul = require('gulp-istanbul'),
    karma = require('karma'),
    gutil = require('gulp-util'),
    gls = require('gulp-live-server'),
    webpack = require('webpack'),
    sequence = require('gulp-sequence');

var paths = {
  express: ['lib/**/*.js', 'models/**/!(index).js'],
  angular: ['js/**/*.js'],
  tests: {
    backend: ['test/server/**/*-spec.js']
  }
};

gulp.task('server', function() {
  var server = gls('.');
  server.start().then(function(result) {
    gutil.log('Server exited with result:', result);
  });
  return gulp.watch(paths.express, function(file) {
    gutil.log(file);
    server.start.apply(server);
  });
});

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

gulp.task('watch:test:frontend', function(done) {
  new karma.Server({
    configFile: __dirname + '/test/karma.conf.js'
  }, done).start();
});

gulp.task('test', function(cb) {
  sequence('test:backend', 'test:frontend', function() {
    cb();
    process.exit();
  });
});

gulp.task('webpack', function(done) {
  webpack(require('./webpack.config.js'), function() { done() });
});

gulp.task('watch:webpack', ['webpack'], function() {
  return gulp.watch(paths.angular, ['webpack']);
});

gulp.task('default', ['server', 'watch:webpack']);
