var keys = require('lodash/object/keys');
var omit = require('lodash/object/omit');
var pick = require('lodash/object/pick');

var ATTR_KEY          = '$';
var NS_SEPARATOR      = ':';
var REF_TMPL          = 'xmlReactLoader-';
var ROOT_REF          = REF_TMPL + 'root';
var XML_NAMESPACE_KEY = 'xmlns';

/**
 * Remove any non-jsx xml attributes from the given node and any of its child
 * nodes. Return the original node sanitized.
 *
 * The optional context argument can be used to get a mapping of reference
 * strings to unsafe attributes for that reference key.
 *
 * @param {Object} xmlNode
 * @param {Object} [context]
 * @returns {Object} the node that was given
 */
module.exports = function sanitize (xmlNode, context) {
    var attrs = xmlNode.$;
    var unsafeAttrs =
            attrs &&
            pick(attrs, function (value, key) {
                return !!~key.indexOf(NS_SEPARATOR);
            });
    var unsafeKeys = unsafeAttrs && keys(unsafeAttrs);
    var isRoot = false;

    // first time through?
    if (!context || !context._) {
        isRoot      = true;
        context     = context || {};
        context._   = { refCount: 0 };
        context.ns  = context.ns || {};
        context.map = context.map || {};
    }

    if (unsafeKeys && unsafeKeys.length) {
        var refKey;

        if (isRoot) {
            refKey = ROOT_REF;
        }
        else {
            refKey = REF_TMPL + context._.refCount++;
        }

        var namespaces = context.ns;
        var map = context.map;
        // determine if we have any namespace definitions
        // add them to our internal references
        // otherwise just flag them to be used later
        unsafeKeys.
            forEach(function (key) {
                var i = key.indexOf(NS_SEPARATOR);
                var ns = key.slice(0, i);
                var attr = key.slice(i + 1);

                if (ns === XML_NAMESPACE_KEY) {
                    namespaces[attr] = unsafeAttrs[key];
                }
            });

        xmlNode[ATTR_KEY] = omit(attrs, unsafeKeys);
        xmlNode[ATTR_KEY].ref = refKey;
        map[refKey] = unsafeAttrs;
    }

    keys(omit(xmlNode, ATTR_KEY)).
        forEach(function (key) {
            var child = xmlNode[key];
            if (Array.isArray(child)) {
                child.forEach(function (c) {
                    sanitize(c, context);
                });
            }
            else {
                sanitize(xmlNode[key], context);
            }
        });

    return xmlNode;
};
