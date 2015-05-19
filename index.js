#!/usr/bin/env node

'use strict';

var fileSearch = require('./lib/fileSearch'),
    buildFile = require('./lib/buildFile'),
    readYaml = require('read-yaml'),
    path = require('path'),
    chalk = require('chalk'),
    program = require('commander');

var tpl = [];
var filesCreated = 0;

program
  .version('0.0.1')
  .option('-f, --force', 'Force file override')
  .option('-d, --destination [value]', 'Template file destination')
  .parse(process.argv);

console.log(chalk.green('-------------------------------------------------------------'));
console.log(chalk.green('processing'));
console.log(chalk.green('-------------------------------------------------------------'));

fileSearch.find('.', 'cinc_display.node', function(files) {
  files.forEach(function(file) {

    tpl.push({file: file, entity: {}, fields: []});
    readYaml(file, function(err, data) {
      if (err) throw err;
      var fields = data.shown_fields;

      if (fields === undefined) {
        fields = [];
      }

      var fieldPath = fields.map(function(field) {
        var contentObj = {};

        var contentType = file.split('/').pop().split('|');
        contentObj['path'] = file;
        contentObj['field'] = field;
        contentObj['viewMode'] = contentType.pop().split('.')[0];
        contentObj['contentType'] = contentType[1];

        return contentObj;
      });

      var pathIndex = tpl.filter(function(value) {
        return value.file === file;
      })[0];

      var contentType = file.split('/').pop().split('|');
      pathIndex.entity.viewMode = contentType.pop().split('.')[0];
      pathIndex.entity.contentType = contentType[1];

      fieldPath.forEach(function(contentObj) {
        fileSearch.fieldInfo(contentObj, function(info) {
          info.forEach(function(fieldYml) {
            readYaml(fieldYml, function(err, data) {
              if (err) throw err;

              if (data.field_type !== undefined) {

                var fieldObj = {};

                fieldObj['fieldType'] = data.field_type;
                fieldObj['field'] = contentObj.field;

                var pathIndex = tpl.filter(function(value) {
                  return value.file === file && value.entity.viewMode === contentObj.viewMode;
                })[0];

                pathIndex.fields.push(fieldObj);


              }

            });
          });
        });
      });
    });
  });

  // Build the file
  tpl.forEach(function(tplItem) {
    buildFile.build(tplItem, program, function(err, count) {
      filesCreated = count;
    });
  });

});

console.log(chalk.green('-------------------------------------------------------------'));
console.log(chalk.green('finished. Created ' + filesCreated + ' file(s)'));
console.log(chalk.green('-------------------------------------------------------------'));
