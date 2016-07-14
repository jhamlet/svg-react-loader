/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/xml/parse', () => {
    const read = require('../../../lib/util/read-file');

    it('should parse simple xml correctly', (done) => {
        const sanitize = require('../../../lib/sanitize')({
            filters: [
                require('../../../lib/sanitize/filters/normalize-node')(null),
                require('../../../lib/sanitize/filters/text-content')(null),
                require('../../../lib/sanitize/filters/camel-case-props')(null),
                require('../../../lib/sanitize/filters/prop-mapper')(null),
                require('../../../lib/sanitize/filters/remove-xmlns-props')(null)
            ]
        });
        const xmlParser = require('../../../lib/xml/parse')(null);

        read('test/samples/simple.svg').
            flatMap(xmlParser).
            map(sanitize).
            subscribe(
                (result) => {
                    result.
                        should.
                        eql({
                            "props": {
                                "version": "1.1",
                                "x": "0px",
                                "y": "0px",
                                "viewBox": "0 0 16 16",
                                "enableBackground": "new 0 0 16 16",
                                "xmlSpace": "preserve",
                                "className": "simple"
                            },
                            "tagname": "svg",
                            "children": [
                                {
                                    "props": {
                                        "x": "0",
                                        "y": "0",
                                        "width": "16",
                                        "height": "16",
                                        "fill": "#fff"
                                    },
                                    "tagname": "rect"
                                },
                                {
                                    tagname: "text",
                                    children: [
                                        "Foobar"
                                    ]
                                }
                            ]
                        });
                },
                (error) => { throw error; },
                done
            );
    });

    it('should parse text in xml correctly', (done) => {
        const sanitize = require('../../../lib/sanitize')({
            filters: [
                require('../../../lib/sanitize/filters/text-content')(null),
                require('../../../lib/sanitize/filters/normalize-node')(null),
                require('../../../lib/sanitize/filters/prop-mapper')(null),
                require('../../../lib/sanitize/filters/remove-xmlns-props')(null)
            ]
        });
        const xmlParser = require('../../../lib/xml/parse')(null);

        read('test/samples/text.svg').
            flatMap(xmlParser).
            map(sanitize).
            subscribe(
                (result) => {
                    result.
                        should.
                        eql({
                            tagname: "svg",
                            children: [
                                {
                                    tagname: "g",
                                    children: [
                                        {
                                            tagname: "title",
                                            children: [
                                                "The Title"
                                            ]
                                        },
                                        {
                                            tagname: "text",
                                            props: {
                                                x: "20",
                                                y: "20"
                                            },
                                            children: [
                                                "Text"
                                            ]
                                        }
                                    ]
                                }
                            ]
                        });
                },
                (error) => { throw error; },
                done
            );
    });

    it('should parse styles in xml correctly', (done) => {
        const sanitize = require('../../../lib/sanitize')({
            filters: [
                require('../../../lib/sanitize/filters/text-content')(null),
                require('../../../lib/sanitize/filters/normalize-node')(null),
                require('../../../lib/sanitize/filters/camel-case-props')(null),
                require('../../../lib/sanitize/filters/prop-mapper')(null),
                require('../../../lib/sanitize/filters/remove-xmlns-props')(null),
                require('../../../lib/sanitize/filters/prefix-style-class-id')({
                    prefix: 'styles-test__'
                })
            ]
        });

        const xmlParser = require('../../../lib/xml/parse')(null);

        read('test/samples/styles.svg').
            flatMap(xmlParser).
            map(sanitize).
            subscribe(
                (result) => {
                    result.
                        should.
                        eql({
                            props: {
                                version:             '1.1',
                                id:                  'Layer_1',
                                width:               '50px',
                                height:              '50px',
                                x:                   '0px',
                                y:                   '0px',
                                viewBox:             '0 0 50 50',
                                style:               'enable-background:new 0 0 50 50;',
                                xmlSpace:            'preserve',
                                preserveAspectRatio: 'none'
                            },
                            tagname: "svg",
                            children: [
                                {
                                    tagname: 'style',
                                    props: {
                                        type: 'text/css'
                                    },
                                    children: [
                                        '.styles-test__st0{fill-rule:evenodd;clip-rule:evenodd;fill:#B2B2B2;}.styles-test__foo{background:url(\'foo/bar/baz.jpg\');}'
                                    ]
                                },
                                {
                                    tagname: 'style',
                                    children: [
                                        '.styles-test__bar{background:url(\'foo/fux.jpg\');}'
                                    ]
                                },
                                {
                                    tagname: 'g',
                                    children: [
                                        {
                                            tagname: 'g',
                                            children: [
                                                {
                                                    tagname: 'style',
                                                    children: [
                                                        '.styles-test__baz{background:url(\'foo/fux.jpg\');}'
                                                    ]
                                                },
                                                {
                                                    tagname: 'path',
                                                    props: {
                                                        className: ".styles-test__st0",
                                                        d: "M14.5,18v2h21v-2H14.5z M14.5,26h21v-2h-21V26z M14.5,32h21v-2h-21V32z"
                                                    }
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        });
                },
                (error) => { throw error; },
                done
            );
    });
});
