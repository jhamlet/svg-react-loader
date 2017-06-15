/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/sanitize/filters/prefix-style-class-id', () => {
    const traverse = require('traverse');
    const prefixStyleClassnames =
        require('../../../../lib/sanitize/filters/prefix-style-class-id')(null);

    it('should work on a simple tree', () => {
        const tree = {
            tagname: 'style',
            children: [
                '.foo { background-color: #333; }'
            ]
        };

        var result = traverse.map(tree, prefixStyleClassnames);

        result.
            should.
            eql({
                tagname: 'style',
                children: [
                    '.filename-prefix__foo{background-color:#333;}'
                ]
            });
    });

    it('should work on a more complex tree', () => {
        const tree = {
            tagname: 'svg',
            children: [
                {
                    tagname: 'style',
                    children: [
                        '.foo { background-color: #fff; }',
                        '#bar { border: 1px; }'
                    ]
                },
                {
                    tagname: 'style',
                    children: [
                        '#bar .foo { background-color: #f00; }',
                        '#bar div { background-color: #f00; }'
                    ]
                }
            ]
        };

        const result = traverse.map(tree, prefixStyleClassnames);

        result.
            should.
            eql({
                tagname: 'svg',
                children: [
                    {
                        tagname: 'style',
                        children: [
                            '.filename-prefix__foo{background-color:#fff;}',
                            '#filename-prefix__bar{border:1px;}'
                        ]
                    },
                    {
                        tagname: 'style',
                        children: [
                            '#filename-prefix__bar .filename-prefix__foo{background-color:#f00;}',
                            '#filename-prefix__bar div{background-color:#f00;}'
                        ]
                    }
                ]
            });
    });
});
