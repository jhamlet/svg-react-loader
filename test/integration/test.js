/*globals describe, it*/
import React, { Component } from 'react';
import SimpleSvg from '../../lib/loader.js?name=SimpleSvg!../samples/simple.svg';
import { mount } from 'enzyme';

require('should');

describe('svg-react-loader', () => {
    it('simple.svg', () => {
        class Icon extends Component {
            render () {
                return <SimpleSvg />;
            }
        };

        const wrapper = mount(<Icon />);

        const expectedSvgProps = {
            version:          "1.1",
            x:                "0px",
            y:                "0px",
            viewBox:          "0 0 16 16",
            enableBackground: "new 0 0 16 16",
            xmlSpace:         "preserve",
            className:        "simple"
        };

        wrapper.
            containsMatchingElement(<svg {...expectedSvgProps} />).
            should.
            be.
            true;

        wrapper.
            containsMatchingElement(<rect x="0" y="0" width="16" height="16" fill="#fff" />).
            should.
            be.
            true;

        wrapper.
            containsMatchingElement(<text>Foobar</text>).
            should.
            be.
            true;
    });
});
