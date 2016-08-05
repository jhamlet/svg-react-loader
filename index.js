var path     = require('path');
var fs       = require('fs');
var lutils   = require('loader-utils');
var sanitize = require('./utility/sanitize');
var getName  = require('./utility/get-name');
var xml2js   = require('xml2js');
var svgo     = require('svgo');
var template = require('lodash/template');
var assign   = require('lodash/assign');
var keys     = require('lodash/keys');
var partial  = require('lodash/partial');

var xmlParser = new xml2js.Parser();
var svgParser = new svgo();
//
// read our template
var tmplPath = path.join(__dirname, 'utility', 'template.txt');

var contents = fs.readFileSync(tmplPath, 'utf8');
var tmpl = template(contents);

function parseSvg (callback, source) {
    svgParser.optimize(source, callback);
}

function parseXml (callback, source) {
    xmlParser.parseString(source.data, callback);
}

function renderJsx (opts, callback, error, xml) {
    if (error) {
        return callback(error);
    }

    var tagName = keys(xml)[0];
    var root    = xml[tagName];

    if (opts.tag) {
        root = xml[opts.tag] = root;
        delete xml[tagName];
        tagName = opts.tag;
        props = root.$ = {};
    }

    var props = assign(sanitize(root).$ || {}, opts.attrs);

    var xmlBuilder = new xml2js.Builder({ headless: true });
    var xmlSrc = xmlBuilder.buildObject(xml);
    var component = tmpl({
        reactDom:      opts.reactDom,
        tagName:       opts.tagName || tagName,
        displayName:   opts.displayName,
        defaultProps:  props,
        innerXml:      xmlSrc.split(/\n/).slice(1, -1).join('\n')
    });

    callback(null, component);
}
/**
 * @param {String} source
 */
module.exports = function (source) {

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
    var reactDom    = params.reactDom || 'react-dom';
    var attrs       = assign({}, params.attrs || {});

    var opts = {
        reactDom:    reactDom,
        tagName:     tag,
        attrs:       attrs,
        displayName: displayName
    };

    var render = partial(renderJsx, opts, callback);
    parseSvg(partial(parseXml, render), source);
};
