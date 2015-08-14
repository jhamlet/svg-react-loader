var path     = require('path');
var fs       = require('fs');
var lutils   = require('loader-utils');
var sanitize = require('./utility/sanitize');
var getName  = require('./utility/get-name');
var xml2js   = require('xml2js');
var template = require('lodash/string/template');
var assign   = require('lodash/object/assign');
var keys     = require('lodash/object/keys');
/**
 * @param {String} source
 */
module.exports = function (source) {
    // read our template
    var tmplPath = path.join(__dirname, 'utility', 'template.txt');
    var tmpl     = template(fs.readFileSync(tmplPath, 'utf8'));

    // let webpack know about us, and get our callback
    var callback = this.async();
    this.addDependency(tmplPath);
    this.cacheable();

    // parameters to the loader
    var query     = lutils.parseQuery(this.query);
    var rsrcPath  = this.resourcePath;
    var rsrcQuery = lutils.parseQuery(this.resourceQuery);

    // resource parameters override loader parameters
    var params = assign({}, query, rsrcQuery);

    var displayName = params.name || getName(rsrcPath);
    var tag         = params.tag || null;
    var attrs       = {};

    if (params.attrs) {
        // easier than having to write json in the query
        // if anyone wants to exploit it, its their build process
        /*eslint no-eval:0*/
        eval('assign(attrs, ' + params.attrs + ');');
    }

    // parse
    var xmlParser = new xml2js.Parser();

    xmlParser.parseString(source, function (error, result) {
        if (error) {
            return callback(error);
        }

        var tagName = keys(result)[0];
        var root    = result[tagName];
        var context  = {};
        var props   = sanitize(root, context).$ || {};

        if (tag) {
            result[tag] = root;
            delete result[tagName];
            tagName = tag;
            props = {};
        }

        props = assign(props, attrs);

        var xmlBuilder = new xml2js.Builder({ headless: true });
        var xmlSrc = xmlBuilder.buildObject(result);
        var component = tmpl({
            tagName:       tagName,
            displayName:   displayName,
            initialProps:  props,
            innerXml:      xmlSrc.split(/\n/).slice(1, -1).join('\n'),
            context:       context
        });

        callback(null, component);
    });
};
