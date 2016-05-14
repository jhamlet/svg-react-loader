var forEach  = require('lodash/forEach');
var ATTR_KEY = 'data-svgreactloader';

var MODULE = {
    /**
     * @param {HTMLElement}
     */
    applyAttributes: function (el) {
        var data = MODULE.hasXmlAttributes(el);
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
        var domEl = MODULE.reactDOM.findDOMNode(component);
        var fn = MODULE.applyAttributes;

        if (domEl) {
            fn(domEl);
            forEach(domEl.querySelectorAll('[' + ATTR_KEY + ']'), fn);
        }
    }
};

module.exports = function helpers (reactDOM) {
    if (!MODULE.reactDOM) {
        MODULE.reactDOM = reactDOM;
    }
    return MODULE;
};
