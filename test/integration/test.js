/*globals describe, it*/
import R from 'ramda';
import React, { Component } from 'react';
import { mount } from 'enzyme';

import SimpleSvg from '../../lib/loader.js?name=SimpleSvg!../samples/simple.svg';
import StylesSvg from '../../lib/loader.js?classIdPrefix!../samples/styles.svg';
import StylesInterpolation from '../../lib/loader.js?classIdPrefix=my-prefix-[name]-[hash:5]-!../samples/styles.svg';
import ReferenceSvg from '../../lib/loader.js?name=SimpleSvg!../samples/reference.svg';

import TextSvg from '../../lib/loader.js!../samples/text.svg';
import ObjectSvg from '../../lib/loader.js!../samples/object.json';

require('should');

const getPropsMinusChildren = R.pipe(
  R.invoker(0, 'props'),
  R.omit(['children'])
);

describe('svg-react-loader', () => {
  const expectedSvgProps = {
    version: '1.1',
    x: '0px',
    y: '0px',
    viewBox: '0 0 16 16',
    enableBackground: 'new 0 0 16 16',
    xmlSpace: 'preserve',
    className: 'simple'
  };

  it('simple.svg', () => {
    class Icon extends Component {
      render() {
        return <SimpleSvg />;
      }
    }

    const wrapper = mount(<Icon />);

    wrapper.containsMatchingElement(<svg {...expectedSvgProps} />).should.be
      .true;

    wrapper.containsMatchingElement(
      <rect x="0" y="0" width="16" height="16" fill="#fff" />
    ).should.be.true;

    wrapper.containsMatchingElement(<text>Foobar</text>).should.be.true;
  });

  it('styles.svg', () => {
    const wrapper = mount(<StylesSvg />);

    const expectedProps = {
      version: '1.1',
      id: 'Layer_1',
      width: '50px',
      height: '50px',
      x: '0px',
      y: '0px',
      viewBox: '0 0 50 50',
      style: {
        enableBackground: 'new 0 0 50 50'
      },
      xmlSpace: 'preserve',
      preserveAspectRatio: 'none'
    };

    getPropsMinusChildren(wrapper.find('svg')).should.eql(expectedProps);

    wrapper.containsMatchingElement(<svg {...expectedProps} />).should.be.true;

    wrapper
      .childAt(0)
      .text()
      .should.equal(
        '.Styles__st0{fill-rule:evenodd;clip-rule:evenodd;fill:#B2B2B2;}' +
          ".Styles__foo{background:url('foo/bar/baz.jpg');}"
      );
  });

  it('styles.svg - with interpolation', () => {
    const wrapper = mount(<StylesInterpolation />);

    if (!wrapper.html().match(/\.my-prefix-styles-1f3e1-foo/)) {
      throw new Error('it should contain the interpolated className');
    }
    if (wrapper.html().match(/\[name]/)) {
      throw new Error('should have [name] replaced with the filename');
    }
    if (wrapper.html().match(/\[hash:5]/)) {
      throw new Error('should have [hash:5] replaced with a hash');
    }
  });

  it('text.svg', () => {
    const wrapper = mount(<TextSvg />);

    wrapper.containsMatchingElement(<svg />).should.be.true;

    wrapper.containsMatchingElement(<title>The Title</title>).should.be.true;

    wrapper.containsMatchingElement(
      <text x="20" y="20">
        Text
      </text>
    ).should.be.true;
  });

  it('object.svg', () => {
    const wrapper = mount(<ObjectSvg />);
    const expectedProps = {
      viewBox: '0 0 16 16',
      enableBackground: 'new 0 0 16 16',
      xmlSpace: 'preserve'
    };

    wrapper.containsMatchingElement(<svg {...expectedProps} />).should.be.true;

    wrapper.containsMatchingElement(
      <rect x="0" y="0" width="16" height="16" fill="#fff" />
    ).should.be.true;

    wrapper.containsMatchingElement(<text>Foobar</text>).should.be.true;
  });

  it('reference.svg', () => {
    class Icon extends Component {
      render() {
        return <ReferenceSvg />;
      }
    }

    const wrapper = mount(<Icon />);

    wrapper
      if (!wrapper.html().match(/#a/)) {
        throw new Error('it should contain the interpolated className');
      }
  });
});
