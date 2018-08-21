var R = require('ramda');
var css = require('css');

var DEFAULTS = {
    prefix:      'filename-prefix__',
};

module.exports = function configureUniquePrefixId (opts) {
    var options = R.merge(DEFAULTS, opts || {});
    var cache   = options.cache = {};
    var selectorRegex = /(url\(#)((\w|-)*)(\))/gmi;

    _getMatches = (field, val) => {
        var str = val.toString();
        var matches = selectorRegex.exec(str);
        // console.log(`-----------\n ${field} id is: ${opts.prefix + matches[2].replace('\"', "")}`);
        selectorRegex.lastIndex = 0;
        return opts.prefix + matches[2].replace('\"', "");

    }

    return function createUniquePrefixId (value) {
        var hasID = false;
        var path        = this.path;
        // var isStyle     = isStyleNode(value);
        // var hasChildren = hasChildrenKey(value);
        // if(opts.prefix === "Bars__") console.log(`******* bars : ${JSON.stringify(value, null, 2)}`);
        if (value.xlinkHref && value.xlinkHref.toString().startsWith("#")){
            var newValue = "#" + opts.prefix + value.xlinkHref.toString().replace("#", "");
            // console.log(`****** new xlink:href: ${newValue}`);
            value.xlinkHref = newValue;
            this.update(value);
        }
        if (value.id){
            console.log(`value id: ${JSON.stringify(value.id, null, 2)}`);
            var newValue = opts.prefix + value.id;
            value.id = newValue;
            // console.log(`#######################\n value here: ${JSON.stringify(value, null, 2)}`);
            // console.log(`=======================\n before this:`);
            // console.log(this);
            // console.log(`new id: ${value.id}`);
            this.update(value);
            // console.log(`+++++++++++++++++++++++\n after this:`);
            // console.log(this);
            // console.log(`updated values: ${JSON.stringify(value, null, 2)}`);
            hasID = true;
        }
        if (value.fill && value.fill.toString().startsWith("url")){
            // console.log(`value fill: ${JSON.stringify(value.fill, null, 2)}`);
            var newValue = "url(#" + _getMatches('fill', value.fill) + ")";
            // console.log(`new fill id: ${newValue}`);
            value.fill = newValue;
            this.update(value);
            // console.log(`updated values: ${JSON.stringify(value, null, 2)}`);
            hasID = true;
        }
        if (value.mask && value.mask.toString().startsWith("url")){
            // console.log(`value mask: ${JSON.stringify(value.mask, null, 2)}`);
            var newValue = _getMatches('mask', value.mask);
            var newValue = "url(#" + _getMatches('fill', value.mask) + ")";
            // console.log(`new mask id: ${newValue}`);
            value.mask = newValue;
            this.update(value);
            // console.log(`updated values: ${JSON.stringify(value, null, 2)}`);
            hasID = true;
        }
        // if (hasID) console.log(JSON.stringify(opts.prefix, null, 2));
    };
};
