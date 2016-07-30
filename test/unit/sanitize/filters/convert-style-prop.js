/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/sanitize/filters/convert-style-prop', () => {
    var convertStyleProp = require('../../../../lib/sanitize/filters/convert-style-prop');

    describe('.camelCaseStyles()', () => {
        it('should return the correct style object', () => {
            convertStyleProp.
                camelCaseStyles('enable-background: new 0 0 50 50;').
                should.
                eql({
                    enableBackground: 'new 0 0 50 50'
                });
        })
    });
});
