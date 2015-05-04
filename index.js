#!/usr/bin/env node

'use strict';

var fileSearch = require('./lib/fileSearch'),
    buildFile = require('./lib/buildFile'),
    readYaml = require('read-yaml'),
    path = require('path');

var tpl = [];

console.log('-------------------------------------------------------------');
console.log('processing');
console.log('-------------------------------------------------------------');

fileSearch.find('.', 'cinc_display.node', function(files) {
  files.forEach(function(file) {

    tpl.push({file: file, entity: {}, fields: []});
    readYaml(file, function(err, data) {
      if (err) throw err;
      var fields = data.shown_fields;

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

                // Build the file
                tpl.forEach(function(tpl) {
                  buildFile.build(tpl);
                });

              }

            });
          });
        });
      })
    });
  });
console.log('-------------------------------------------------------------');
console.log('finished. Created ' + tpl.length + ' file(s)');
console.log('-------------------------------------------------------------');
});
