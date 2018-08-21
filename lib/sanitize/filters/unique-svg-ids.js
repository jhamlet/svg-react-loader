var R = require('ramda');
var css = require('css');

// This should be changed, because this isn't going to help
// anyone in the case of a failure to get filename for prefix.
var DEFAULTS = {
    prefix:      'filename-prefix__',
};

module.exports = function configureUniquePrefixId (opts) {
    var options = R.merge(DEFAULTS, opts || {});
    var cache   = options.cache = {};
    var selectorRegex = /(url\(#)((\w|-)*)(\))/gmi;

    // Find the ID reference in items such as: "url(#a)" and return "a"
    _getMatches = (field, val) => {
        var str = val.toString();
        var matches = selectorRegex.exec(str);
        selectorRegex.lastIndex = 0;
        // clean up and get rid of the quotes
        return opts.prefix + matches[2].replace('\"', "");
    }

    return function createUniquePrefixId (value) {
        // Find all the xlink:href props with local references and update
        if (value.xlinkHref && value.xlinkHref.toString().startsWith("#")){
            var newValue = "#" + opts.prefix + value.xlinkHref.toString().replace("#", "");
            value.xlinkHref = newValue;
            this.update(value);
        }

        // Find all IDs and update with filename prefix
        if (value.id){
            var newValue = opts.prefix + value.id;
            value.id = newValue;
            this.update(value);
        }

        // Find all fill props and update with filename prefix
        if (value.fill && value.fill.toString().startsWith("url")){
            var newValue = "url(#" + _getMatches('fill', value.fill) + ")";
            value.fill = newValue;
            this.update(value);
        }

        // Find all mask props and update with filename prefix
        if (value.mask && value.mask.toString().startsWith("url")){
            var newValue = _getMatches('mask', value.mask);
            var newValue = "url(#" + _getMatches('fill', value.mask) + ")";
            value.mask = newValue;
            this.update(value);
        }
    };
};
