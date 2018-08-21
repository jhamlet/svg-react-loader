/*globals describe, it*/
require('should');

describe('svg-react-loader/lib/sanitize/filters/unique-svg-ids', () => {
  const traverse = require('traverse');
  const prefixFilename =
    require('../../../../lib/sanitize/filters/unique-svg-ids')({prefix: 'svgFilename__'});

  it('should work on a simple tree', () => {
    const tree = {
      id: 'a',
      fill: 'url(#a)',
      mask: 'url(#a)',
      xlinkHref: '#a'
    };

    var result = traverse.map(tree, prefixFilename);

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

    const result = traverse.map(tree, prefixFilename);

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

  it('should not update values for fill, mask, or xlink:href if they are not references to IDs', () => {
    const tree = {
      id: 'c',
      fill: '#fafafa',
      mask: '#ae4d19',
      xlinkHref: 'http://www.w3.org/1999/xlink'
    };

    const result = traverse.map(tree, prefixFilename);

    result.
      should.
      eql({
        id: 'svgFilename__c',
        fill: '#fafafa',
        mask: '#ae4d19',
        xlinkHref: 'http://www.w3.org/1999/xlink'
      });
  });
});
