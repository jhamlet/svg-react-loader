/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/util/title-case', () => {
    const titleCase = require('../../../lib/util/title-case');

    const expectations = [
        {
            delim: /[:-]/,
            text: 'foo',
            result: 'Foo'
        },
        {
            delim: /[:-]/,
            text: 'foo-bar',
            result: 'FooBar'
        },
        {
            delim: /[:-]/g,
            text: 'foo-bar-baz',
            result: 'FooBarBaz'
        }
    ];

    expectations.
    forEach((spec) => {
        const description = `titleCase(/${spec.delim.source}/, '${spec.text}') should equal '${spec.result}'`;

        it(description, () => {
            titleCase(spec.delim, spec.text).
                should.
                equal(spec.result);
        });

    });
});
