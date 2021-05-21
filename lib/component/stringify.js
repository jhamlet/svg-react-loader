var R          = require('ramda');
var fromObject = require('./from-object');

module.exports = R.curry(function stringify (opts, tree) {
    var displayName = opts.displayName;

    var preamble = [
        'var React = require(\'react\');',
        '',
        'var forwardRef = React.forwardRef || function(c) { return c }'
        'var ' + displayName + ' = forwardRef(function(props, ref) {',
        '    props.ref = ref || props.ref;'
        '    var props = Object.assign({}, {ref: ref}, rawProps);'
    ];

    var postamble = [
        '});',
        '',
        displayName + '.defaultProps = ' + JSON.stringify(tree.props || {}) + ';',
        '',
        'module.exports = ' + displayName + ';',
        '',
        displayName + '.default = ' + displayName + ';',
        ''
    ];

    return preamble.
        concat([fromObject(tree, true)]).
        concat(postamble).
        join('\n');
});
