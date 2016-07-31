SVG to React Loader
===================

> A Webpack Loader to turn SVGs into React Components


Summary
-------

A wepack loader allowing for inline usage of a SVG as a React component, or for
composing individual SVGs into larger ones.

The latest version has been refactored to allow for receiving an SVG/XML string
or an [object-tree](#object-tree-api) representing an SVG. This allows for other
loaders before `svg-react` to alter/update/remove nodes before reaching
`svg-react` and not having to convert back to an XML/SVG string.

In addition, the new [filters](#filters) API allows for additional ways to
modify the generated SVG Component. This allows `svg-react` to also be used as a
pre-loader (with `filters` and `stringify=false` params) for modifying SVGs
before they are acted on by the loader version of `svg-react`.

Installation
------------

~~~
% npm install --save-dev svg-react-loader
~~~


Usage
-----

ES6+ (Assuming a `babel-loader` is used on `/\.jsx?$/` files):

~~~js
import React, { Component } from 'react';
import Icon from 'svg-react?name=Icon!../svg/my-icon.svg';

export default class MyIcon extends Component {
    render () {
        return <Icon className='normal' />;
    }
};
~~~

ES5

~~~js
var React = require('react');
var Icon = require('svg-react?name=Icon!../svg/my-icon/svg');

module.exports = React.createClass({
    render () {
        return React.createElement(Icon, { className: 'normal' });
    }
});
~~~


Documentation
-------------

### Query Params

Query params can be used on the loader path, or on the resource's path. Those on
the resource will override those given for the loader.

* `name`: `displayName` to use for the compiled component. Defaults to using the
  resource's file name, capitalized and camelCased. ex. `"?name=MyIcon"`

* `tag`: Override the root-level tag name.

* `props`: Attributes to apply to the root-level tag. If a certain attribute is
  already assigned to the tag, the value here will override that.

* `attrs`: Alias for `props`

* `filters`: If given on the query string, it is a list of module names, or
  filepaths, to load as [filter functions](#filters). If given in the webpack
  config as a `svgReactLoader.filters`, or as `query.filters` for the loader
  configuration object, it is an array of functions.

* `classIdPrefix`: A string to prefix all class or id selectors in found style
  blocks, or within `className` properties, with. If indicated without a string,
  the file's basename will be used as a prefix.

* `stringify`: If set to `false`, the loader will return an object tree of the
  parsed SVG. Default is `true`.

* `propsMap`: If given on the query string, it is an array of colon separated
  `propname:translatedname` pairs. If given in the webpack configuration as
  `svgReactLoader.propsMap`, or in an object query for the loader configuration,
  is a simple object of `propname: 'translatedname'`

* `xmlnsTest`: A regular expression used to remove non-supported xmlns
  attributes. Default is /^xmlns(Xlink)?$/

#### Examples

~~~js
// webpack configuration
module: {
    loaders: [
        {
            test: /\.svg$/,
            exclude: /node_modules/,
            loader: 'svg-react',
            query: {
                classIdPrefix: '[name]-[hash:8]__',
                filters: [
                    function (value) {
                        // ...
                        this.update(newvalue);
                    }
                ],
                propsMap: {
                    fillRule: 'fill-rule',
                    foo: 'bar'
                },
                xmlnsTest: /^xmlns.*$/
            }
        }
    ]
}

// Resource paths
import MyIcon from 'svg-react?name=MyIcon!../svg/icon.svg';
import MyIcon from 'svg-react?tag=symbol!../svg/icon.svg';
import MyIcon from 'svg-react?tag=symbol&props[]=id:my-icon?../svg/icon.svg';
import MyIcon from 'svg-react?filters[]=./my-filter.js!../svg/icon.svg';
~~~


### Object Tree API

### Filters

Report an Issue
---------------

* [Bugs](http://github.com/jhamlet/svg-react-loader/issues)
* Contact the author: <jerry@hamletink.com>


License
-------

> Copyright (c) 2016 Jerry Hamlet <jerry@hamletink.com>
> 
> Permission is hereby granted, free of charge, to any person
> obtaining a copy of this software and associated documentation
> files (the "Software"), to deal in the Software without
> restriction, including without limitation the rights to use,
> copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the
> Software is furnished to do so, subject to the following
> conditions:
> 
> The above copyright notice and this permission notice shall be
> included in all copies or substantial portions of the Software.
> 
> The Software shall be used for Good, not Evil.
> 
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
> EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
> OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
> NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
> HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
> WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
> FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
> OTHER DEALINGS IN THE SOFTWARE.
