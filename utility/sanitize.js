var keys = require('lodash/keys');
var omit = require('lodash/omit');
var camelCase = require('lodash/camelCase');

var XML_ATTR_KEY      = '$';
var XML_TEXT_NODE_KEY = '_';
var NS_SEPARATOR      = ':';
var DATA_ATTR_KEY     = 'data-svgreactloader';
var XML_NAMESPACE_KEY = 'xmlns';
var TEXT_REGEX        = /(["'])/g;

var XML_NAMESPACES = {
    svg: 'http://www.w3.org/2000/svg',
    xlink: 'http://www.w3.org/1999/xlink'
};

var STYLE_ATTR_KEY = 'style';

var RESERVED_KEYS = {
    'class': 'className',
    'for': 'htmlFor'
};

/**
 * @param {Object[]} nodes
 */
function sanitizeStyleNodes (nodes) {
    nodes.
        forEach(function (node, idx, context) {
            var isText = typeof node === 'string';
            var src = isText ? node : node[XML_TEXT_NODE_KEY];
            var text = '{`' + src.replace(TEXT_REGEX, "\\$1") + '`}';

            if (isText) {
                context[idx] = text;
            }
            else {
                node[XML_TEXT_NODE_KEY] = text;
            }
        });
}

/**
 * Remove any non-jsx xml attributes from the given node and any of its child
 * nodes. Return the original node sanitized.
 *
 * @param {Object|Object[]} xmlNode
 * @param {Object} [namespaces]
 * @returns {Object} the node that was given
 */
module.exports = function sanitize (xmlNode, namespaces) {
    namespaces = namespaces || Object.create(XML_NAMESPACES);

    if (Array.isArray(xmlNode)) {
        xmlNode.
        forEach(function (child) { sanitize(child, namespaces); });
    }
    else {
        if (xmlNode[XML_ATTR_KEY]) {
            xmlNode[XML_ATTR_KEY] =
                keys(xmlNode[XML_ATTR_KEY]).
                reduce(function (acc, key) {
                    var i      = key.indexOf(NS_SEPARATOR);
                    var hasSep = !!~i;
                    var ns     = hasSep && key.slice(0, i);
                    var attr   = hasSep ? key.slice(i + 1) : key;
                    var value  = xmlNode[XML_ATTR_KEY][key];
                    var nsKey  = hasSep ? ns : attr;

                    if (nsKey === XML_NAMESPACE_KEY && !hasSep) {
                        namespaces.xml = value;
                    }
                    else if (nsKey === XML_NAMESPACE_KEY) {
                        namespaces[attr] = value;
                    }

                    nsKey = nsKey === XML_NAMESPACE_KEY ? 'xml' : nsKey;

                    if (ns && attr || attr === STYLE_ATTR_KEY) {
                        acc[DATA_ATTR_KEY] = acc[DATA_ATTR_KEY] || [];
                        acc[DATA_ATTR_KEY].push([namespaces[nsKey], attr, value]);
                    }
                    else {
                        acc[RESERVED_KEYS[key] || camelCase(key)] = value;
                    }

                    return acc;
                }, {});

        }

        // Process the children of this node
        keys(omit(xmlNode, [XML_ATTR_KEY, XML_TEXT_NODE_KEY])).
            forEach(function (key) {
                var node = xmlNode[key];

                if (typeof node === 'string') {
                    return;
                }
                else if (key === 'style') {
                    sanitizeStyleNodes(node);
                }
                else {
                    sanitize(node, namespaces);
                }
            });

        // Serialize our data attribute
        if (xmlNode[XML_ATTR_KEY] && xmlNode[XML_ATTR_KEY][DATA_ATTR_KEY]) {
            xmlNode[XML_ATTR_KEY][DATA_ATTR_KEY] =
                JSON.stringify(xmlNode[XML_ATTR_KEY][DATA_ATTR_KEY]);
        }
    }

    return xmlNode;
};
