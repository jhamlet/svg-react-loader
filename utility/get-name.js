var path = require('path');
var camelCase = require('lodash/camelCase');

module.exports = function getName (filepath) {
    var ext      = path.extname(filepath);
    var basename = path.basename(filepath, ext);
    return basename[0].toUpperCase() + camelCase(basename.slice(1));
};
