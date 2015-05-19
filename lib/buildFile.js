'use strict';

var gulp = require('gulp'),
    build = require('gulp-build'),
    rename = require('gulp-rename'),
    path = require('path'),
    appRoot = path.resolve(__dirname),
    buildPath = '.',
    fs = require('fs'),
    chalk = require('chalk');

var buildFile = function() {

  var self = {
    build: function(tpl, program, fn) {

      if (program.destination) {
        buildPath = program.destination;
      }

      var count = 0;
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

      var fileName = 'node' + viewModeFilename + tplFilename + '.tpl.php';

      fs.readdir(buildPath, function(err, files) {
        if (err) throw err;

        if (files.indexOf(fileName) !== -1 && !program.force) {
          console.log(chalk.yellow(fileName + ' already exists'));
          console.log(chalk.gray.bgYellow('Use --force to override files.'));
          return;
        }

        if (files.indexOf(fileName) === -1) {

          gulp.src(appRoot + '/templates/node.tpl.php')
          .pipe(build({
            tpl: file[1],
            viewMode: viewMode[0],
            fields: tpl.fields,
          }, options))
          .pipe(rename('node' + viewModeFilename + tplFilename + '.tpl.php'))
          .pipe(gulp.dest(buildPath));

          count++;
        }

      });
      fn(null, count);
    },
  }

  return self;
}

module.exports = buildFile();
