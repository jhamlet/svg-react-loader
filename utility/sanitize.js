var keys = require('lodash/object/keys');
var omit = require('lodash/object/omit');

var ATTR_KEY          = '$';
var NS_SEPARATOR      = ':';
var DATA_ATTR_KEY     = 'data-svgreactloader';
var XML_NAMESPACE_KEY = 'xmlns';

/**
 * Remove any non-jsx xml attributes from the given node and any of its child
 * nodes. Return the original node sanitized.
 *
 * @param {Object} xmlNode
 * @returns {Object} the node that was given
 */
module.exports = function sanitize (xmlNode, namespaces) {
    namespaces = namespaces || {};

    xmlNode.$ =
        keys(xmlNode.$).
        reduce(function (acc, key) {
            var i      = key.indexOf(NS_SEPARATOR);
            var hasSep = !!~i;
            var ns     = hasSep && key.slice(0, i);
            var attr   = hasSep ? key.slice(i + 1) : key;
            var value  = xmlNode.$[key];
            var nsKey  = hasSep ? ns : attr;

            if (nsKey === XML_NAMESPACE_KEY && !hasSep) {
                namespaces.xml = value;
            }
            else if (nsKey === XML_NAMESPACE_KEY) {
                namespaces[attr] = value;
            }

            nsKey = nsKey === XML_NAMESPACE_KEY ? 'xml' : nsKey;

            if (ns && attr) {
                acc[DATA_ATTR_KEY] = acc[DATA_ATTR_KEY] || [];
                acc[DATA_ATTR_KEY].push([namespaces[nsKey], attr, value]);
            }
            else {
                acc[key] = value;
            }

            return acc;
        }, {});

    if (xmlNode.$[DATA_ATTR_KEY]) {
        xmlNode.$[DATA_ATTR_KEY] = JSON.stringify(xmlNode.$[DATA_ATTR_KEY]);
    }

    keys(omit(xmlNode, ATTR_KEY)).
        forEach(function (key) {
            var child = xmlNode[key];
            if (Array.isArray(child)) {
                child.forEach(function (child) {
                    sanitize(child, namespaces);
                });
            }
            else {
                sanitize(child, namespaces);
            }
        });

    return xmlNode;
};
