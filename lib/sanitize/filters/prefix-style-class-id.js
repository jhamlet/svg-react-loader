var R = require('ramda');
var css = require('css');

var DEFAULTS = {
    prefix:      'filename-prefix__',
    tagKey:      'tagname',
    styleTagKey: 'style',
    childrenKey: 'children'
};

var _CLASSNAME_OR_ID_REGEX = '([a-zA-Z0-9_-]+)';
var CLASSNAME_OR_ID_REGEX = new RegExp(_CLASSNAME_OR_ID_REGEX, 'g');
var _CLASSNAME_OR_ID_SELECTOR_REGEX = '([.#])' + _CLASSNAME_OR_ID_REGEX;
var CLASSNAME_OR_ID_SELECTOR_REGEX = new RegExp(_CLASSNAME_OR_ID_SELECTOR_REGEX, 'g');
var URL_CLASSNAME_OR_ID_SELECTOR_REGEX = new RegExp('url\\(' + _CLASSNAME_OR_ID_SELECTOR_REGEX + '\\)', 'g')

function processStyles (opts, source) {
    var ast = css.parse(source);
    var rules = ast.stylesheet.rules;

    rules.
        forEach(function (rule) {
            var selectors = rule.selectors;
            var declarations = rule.declarations;

            rule.selectors =
                selectors.
                map(function (sel) {
                    return sel.
                        replace(
                            CLASSNAME_OR_ID_SELECTOR_REGEX,
                            function (match, pre, post) {
                                opts.cache[post] = getName(opts, post);
                                return pre + getName(opts, post);
                            }
                        );
                });
            
            rule.declarations =
                declarations.
                map(function (dec) {
                    return {
                        ...dec,
                        value: dec.value.
                            replace(
                                URL_CLASSNAME_OR_ID_SELECTOR_REGEX,
                                function (m, pre, name) {
                                    return 'url(' + pre + getName(opts, name) + ')';
                                }
                            )
                    }
                });
        });

    return css.stringify(ast, { compress: true });
}

function getName(opts, originalName, cache) {
    return cache && cache[originalName] || opts.prefix + originalName;
}

module.exports = function configrePrefixStyleClassId (opts) {
    var options = R.merge(DEFAULTS, opts || {});
    var cache   = options.cache = {};

    var tagKey         = options.tagKey;
    var styleTagKey    = options.styleTagKey;
    var childrenKey    = options.childrenKey;
    var hasChildrenKey = R.has(childrenKey);
    var isStyleNode    = R.where(R.objOf(tagKey, R.equals(styleTagKey)));

    return function prefixStyleClassId (value) {
        var path        = this.path;
        var isStyle     = isStyleNode(value);
        var hasChildren = hasChildrenKey(value);

        if (this.notLeaf && isStyle && hasChildren) {
            value.children =
                value.
                children.
                map(function (child) {
                    if (typeof child === 'string') {
                        return processStyles(options, child);
                    }
                    return child;
                });
        }
        else if (this.isLeaf && ['className', 'id'].includes(path[path.length - 1] )) {
            this.update(
                value.
                    replace(
                        CLASSNAME_OR_ID_REGEX,
                        function (m) {
                            return getName(opts, m, cache);
                        }
                    )
            );
        }
        else if (this.isLeaf && ['stroke', 'fill', 'href', 'clipPath'].includes(path[path.length - 1] )) {
            this.update(
                value.
                    replace(
                        URL_CLASSNAME_OR_ID_SELECTOR_REGEX,
                        function (m, pre, name) {
                            return 'url(' + pre + getName(opts, name, cache) + ')';
                        }
                    )
            );
        } else if (this.isLeaf && path[path.length - 1] === 'xlinkHref') {
            this.update(
                value.replace(CLASSNAME_OR_ID_REGEX, function (m) {
                    return getName(opts, m, cache)
                })
            )
        }
    };
};
