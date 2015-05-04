'use strict';

var gulp = require('gulp'),
    build = require('gulp-build'),
    rename = require('gulp-rename'),
    path = require('path'),
    appRoot = path.resolve(__dirname);

var buildFile = function() {

  var self = {
    build: function(tpl) {

      var options = {
        helpers: [{
          name: 'wrapper',
          fn: function(fieldType) {
            if (fieldType === 'image') {
              return 'figure';
            } else {
              return 'div';
            }
          }
        }]
      };

      var file = tpl.file.split('/').pop().split('|');
      var viewMode = file.pop().split('.');

      var tplFilename = '--' + file[1],
      viewModeFilename = (viewMode && viewMode[0] != 'default') ? '--' + viewMode[0] : '';

      gulp.src(appRoot + '/templates/node.tpl.php')
        .pipe(build({
          tpl: file[1],
          viewMode: viewMode[0],
          fields: tpl.fields,
        }, options))
        .pipe(rename('node' + viewModeFilename + tplFilename + '.tpl.php'))
        .pipe(gulp.dest('.'));
    },
  }

  return self;
}

module.exports = buildFile();
