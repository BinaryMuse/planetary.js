var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var header = require('gulp-header');
var jshint = require('gulp-jshint');
var replace = require('gulp-replace');
var metadata = require('./package.json');

var shortHeader = "/*! Planetary.js <%= version %> | (c) 2013 Michelle Tilley | Released under MIT License */\n"
var fullHeader = [
  "/*! Planetary.js v<%= version %>",
  " *  Copyright (c) 2013 Michelle Tilley",
  " *",
  " *  Released under the MIT license",
  " *  Date: <%= new Date().toISOString() %>",
  " */",
  ""
].join("\n");

var fullSource = gulp.src(['./src/_umd_header.js', './src/body.js', './src/plugins.js', './src/_umd_footer.js']);
var nonPluginSource = gulp.src(['./src/_umd_header.js', './src/body.js', './src/_umd_footer.js']);

function build(source, name, headerText, minify) {
  var js = source.pipe(concat(name));
  if (minify) { js = js.pipe(uglify()); }
  js = js.pipe(header(headerText, { version: metadata.version }));
  js.pipe(replace("\r\n", "\n")).pipe(gulp.dest('./dist'));
}

gulp.task('jshint', function() {
  gulp.src(['./src/body.js', './src/plugins.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('build', function() {
  build(fullSource, 'planetaryjs.js', fullHeader, false);
  build(fullSource, 'planetaryjs.min.js', shortHeader, true);
  build(nonPluginSource, 'planetaryjs-noplugins.js', fullHeader, false);
  build(nonPluginSource, 'planetaryjs-noplugins.min.js', shortHeader, true);

  gulp.src('./src/world-110m.json').pipe(gulp.dest('./dist'));
});

gulp.task('default', ['jshint', 'build']);
