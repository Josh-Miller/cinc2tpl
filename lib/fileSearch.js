'use strict';

var walk = require('fs-walk');

var fileSearch = function() {
  var self = {
    find: function(path, name, fn) {
      var files = [];

      walk.walkSync(path, function(basedir, filename, stat) {
        var filePath = basedir + '/' + filename;
        if (filePath.indexOf(name) !== -1){
          files.push(filePath);
        }
      });
      fn(files);
    },
    fieldPath: function(fields, file) {
      fields.map(function(field) {
        var fieldObj = {};
        fieldObj['path'] = file;
        fieldObj['field'] = field;

        return fieldObj;
      });
    },
    fieldInfo: function(fieldObj, fn) {

      var path = fieldObj.path,
          contentType = fieldObj.contentType,
          field = fieldObj.field,
          pathArray = path.split('/'),
          files = [],
          fieldPath = 'field.field.node.' + contentType + '.' + field;

      pathArray.pop();
      self.find(pathArray.join('/'), fieldPath, function(files) {
        fn(files);
      });

    },
  };

  return self;
}


module.exports = fileSearch();
