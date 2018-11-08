/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/sanitize/filters/remove-xmlns-props', () => {
    var removeXmlnsProps = require('../../../../lib/sanitize/filters/remove-xmlns-props');

    it('should strip the matched props', () => {
        const traverse = require('traverse');
        const tree = {
            tagname: 'svg',
            props: {
                xmlns1: "A",
                xmlns2: "B",
                inkscape1: "C",
                width: "100",
            },
            children: []
        };

        var result = traverse.map(tree, removeXmlnsProps({test: /(xmlns|ink)/}));
        result.
            should.
            eql({
                tagname: 'svg',
                props: {
                    width: "100",
                },
                children: []
            });
    });
});
