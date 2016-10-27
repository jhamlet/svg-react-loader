var path     = require('path');
var fs       = require('fs');
var lutils   = require('loader-utils');
var sanitize = require('./utility/sanitize');
var getName  = require('./utility/get-name');
var xml2js   = require('xml2js');
var template = require('lodash/template');
var assign   = require('lodash/assign');
var keys     = require('lodash/keys');
var partial  = require('lodash/partial');

var cachedTemplate = null;

function readTemplate (callback, filepath) {
    if (cachedTemplate != null) {
        callback(cachedTemplate);
        return;
    }

    fs.readFile(filepath, 'utf8', function (error, contents) {
        if (error) {
            throw error;
        }
        cachedTemplate = template(contents);
        callback(cachedTemplate);
    });
}

function getCustomRoot(xml, roots, depth, source) {
    if (depth >= 3) {
        return null;
    }
    var keyList = keys(xml);
    for (var x = 0; x < keyList.length; x++) {
        var key = keyList[x];
        for (var y = 0; y < roots.length; y++) {
            var root = roots[y];
            if (key === root) {
                var obj = {};
                obj[root] = xml[root][0];
                return obj;
            }
        }
    }
    for (var i = 0; i < keyList.length; i++) {
        var key = xml[keyList[i]];
        var customRoot = getCustomRoot(key, roots, depth + 1);
        if (customRoot != null) {
            return customRoot;
        }
    }
    return null;
}

function parseXml (opts, callback, source) {
    var xmlParser = new xml2js.Parser();
    xmlParser.parseString(source, function(err, xml) {
        if (err) return callback(err);
        if (opts.root) {
            callback(err, getCustomRoot(xml, opts.root.split('|'), 1, source));
        } else {
            callback(err, xml);
        }
    });
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
    var xmlSrc = xmlBuilder.buildObject(opts.root ? root : xml);
    var component = opts.tmpl({
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
    // read our template
    var tmplPath = path.join(__dirname, 'utility', 'template.txt');

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
    var root        = params.root || null;

    var opts = {
        reactDom:    reactDom,
        tagName:     tag,
        attrs:       attrs,
        displayName: displayName,
        root:        root,
    };

    var render = partial(renderJsx, opts, callback);
    var parse = partial(parseXml, opts, render, source);

    readTemplate(function (tmpl) {
        opts.tmpl = tmpl;
        parse();
    }, tmplPath);
};