/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/sanitize/filters/prefix-style-class-id', () => {
  const traverse = require('traverse');
  const prefixStyleClassnames =
    require('../../../../lib/sanitize/filters/unique-svg-ids')({prefix: 'svgFilename__'});

  it('should work on a simple tree', () => {
    const tree = {
      id: 'a',
      fill: 'url(#a)',
      mask: 'url(#a)',
      xlinkHref: '#a'
    };

    var result = traverse.map(tree, prefixStyleClassnames);

    result.
      should.
      eql({
        id: 'svgFilename__a',
        fill: 'url(#svgFilename__a)',
        mask: 'url(#svgFilename__a)',
        xlinkHref: '#svgFilename__a'
      });
  });

  it('should work on a more complex tree', () => {
    const tree = {
      id: 'a',
      fill: 'url(#a)',
      mask: 'url(#a)',
      xlinkHref: '#a',
      props: {
        id: 'b',
        fill: 'url(#b)',
        mask: 'url(#b)',
        xlinkHref: '#b'
      }
    };

    const result = traverse.map(tree, prefixStyleClassnames);

    result.
      should.
      eql({
        id: 'svgFilename__a',
        fill: 'url(#svgFilename__a)',
        mask: 'url(#svgFilename__a)',
        xlinkHref: '#svgFilename__a',
        props: {
          id: 'svgFilename__b',
          fill: 'url(#svgFilename__b)',
          mask: 'url(#svgFilename__b)',
          xlinkHref: '#svgFilename__b'
        }
      });
  });
});
