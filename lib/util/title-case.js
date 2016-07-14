var R = require('ramda');
var uppercaseFirst = require('./upper-case-first');

var DEFAULT = /[:\w-]/;

module.exports = R.curry(function titleCase (delim, text) {
    var words = text.split(delim || DEFAULT);
    return words.
        map(uppercaseFirst).
        join('');
});
