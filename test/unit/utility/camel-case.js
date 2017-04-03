/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/util/camel-case', () => {
    const camelCase = require('../../../lib/util/camel-case');

    const expectations = [
        {
            delim: /[:-]/,
            text: 'foo',
            result: 'foo'
        },
        {
            delim: /[:-]/,
            text: 'foo-bar',
            result: 'fooBar'
        },
        {
            delim: /[:-]/g,
            text: 'foo-bar-baz',
            result: 'fooBarBaz'
        },
        {
            delim: null,
            text: 'foo-bar-baz',
            result: 'fooBarBaz'
        }
    ];

    expectations.
    forEach((spec) => {
        const delim =
                spec.delim ?
                    spec.delim instanceof RegExp ?
                        '/' + spec.delim.source + '/' :
                        spec.delim
                    :
                    spec.delim;
        const description = `camelCase(${delim}, '${spec.text}') should equal '${spec.result}'`;

        it(description, () => {
            camelCase(spec.delim, spec.text).
                should.
                equal(spec.result);
        });

    });
});
