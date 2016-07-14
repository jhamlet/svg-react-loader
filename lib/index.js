var R  = require('ramda');
var Rx = require('rx');
/**
 * @param {Object} opts An options object
 * @param {String} [opts.displayName='SvgReactComponent'] A displayName to use
 * for the generated React Component
 * @param {Object} [opts.root] An alternative root node
 * @param {String} [opts.root.tagname]
 * @param {Object} [opts.root.props]
 * @param {Function[]} [opts.filters] List of additional filters to use when
 * traversing the object tree generated from the SVG
 * @param {Object} [opts.propsMap={'for':'htmlFor','class':'className'}] Hash of
 * prop name mappings
 * @param {String} [opts.classIdPrefix] String to use as a prefix for all class
 * and id selectors in any style nodes or className props found
 * @param {Boolean} [opts.stringify=true] If set to false, will output the
 * object tree representing the react component. Mainly used for testing
 * @param {RegExp} [opts.xmlnsTest=/^xmlns(Xlink)?$/] The regular expression
 * used to find and remove xmlns type props
 * @param {String|Object} source The SVG source, or an object tree representing
 * the SVG
 * @returns {Rx.Observable<String|Object>}
 */

var pickStringifyOpts = R.pick(['displayName']);
var pickSanitizeOpts = R.pick(['filters']);

module.exports = R.curry(function svgToReact (opts, source) {
    var options   = require('./options')(opts);
    var stringify = require('./component/stringify')(pickStringifyOpts(options));
    var sanitize  = require('./sanitize')(pickSanitizeOpts(options));

    var tree =
        typeof source === 'string' ?
            require('./xml/parse')(null, source).map(sanitize) :
            Rx.Observable.just(sanitize(source));

    if (options.stringify) {
        return tree.map(stringify);
    }

    return tree;
});
