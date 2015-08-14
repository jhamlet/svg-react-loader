var React   = require('react');
var keys    = require('lodash/object/keys');
var rootKey = 'xmlReactLoader-root';

var NS_SEPARATOR = ':';

module.exports = {
    /**
     * @param {React.Component}
     */
    applyUnsafe: function (component) {
        var context = component.xmlReactLoader;
        var namespaces = context.ns;
        var map = context.map;

        keys(map).
            forEach(function (key) {
                var ref   = key === rootKey ? component : component.refs[key];
                var el    = React.findDOMNode(ref);
                var attrs = map[key];

                keys(attrs).
                    forEach(function (key) {
                        var i = key.indexOf(NS_SEPARATOR);
                        var nskey = key.slice(0, i);
                        var attr = key.slice(i + 1);

                        if (namespaces[nskey]) {
                            el.setAttributeNS(namespaces[nskey], attr, attrs[key]);
                        }
                        else {
                            el.setAttribute(key, attrs[key]);
                        }
                    });
            });
    }
};
