var React    = require('react');
var forEach  = require('lodash/collection/forEach');
var ATTR_KEY = 'data-svgreactloader';

module.exports = {
    /**
     * @param {HTMLElement}
     */
    applyAttributes: function (el) {
        var data = this.hasXmlAttributes(el);
        if (data) {
            forEach(JSON.parse(data), function (args) {
                var method = 'setAttribute' + (args.length === 3 ? 'NS' : '');
                el[method].apply(el, args);
            });
        }
    },
    /**
     * @param {HTMLElement}
     */
    hasXmlAttributes: function (el) {
        return el && el.getAttribute(ATTR_KEY);
    },
    /**
     * @param {React.Component}
     */
    applyXmlAttributes: function (component) {
        var domEl = React.findDOMNode(component);
        var fn = this.applyAttributes.bind(this);

        if (domEl) {
            fn(domEl);
            forEach(domEl.querySelectorAll('[' + ATTR_KEY + ']'), fn);
        }
    }
};
