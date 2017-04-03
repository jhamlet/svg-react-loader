SVG to React Loader
===================

> A Webpack Loader to turn SVGs into React Components

> **NOTE:** [version
> 0.4.0](https://github.com/jhamlet/svg-react-loader/blob/version-0.4.0/README.md)
> is currently in beta and versions prior to that will no longer be supported.
> After sufficient testing can be completed that will be the latest release.
> Until then you can use the beta by `npm install svg-react-loader@next`.

Summary
-------

A wepack loader allowing for inline usage of a SVG as a React component, or for
composing individual SVGs into larger ones.

The latest version has been refactored to allow for receiving an SVG/XML string
or an JSON [object-tree](#object-tree-api) representing an SVG. This allows for
other loaders before `svg-react` to alter/update/remove nodes before reaching
`svg-react`.

In addition, the new [filters](#filters) API allows for additional ways to
modify the generated SVG Component. This allows `svg-react` to also be used as a
pre-loader (with `filters` and `raw=true` params) for modifying SVGs before they
are acted on by the loader version of `svg-react`.

### Notes

> As of version 0.4.0, `svg-react-loader` no longer requires `babel` to
> transpile the generated code. Everything is returned as an ES5-7 compatible
> module, and the component is just a
> [function](https://facebook.github.io/react/docs/reusable-components.html#stateless-functions).
> With that, it only works with React@>=0.14


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

* `raw`: If set to `true` will output the parsed object tree repesenting the SVG
  as a JSON string. Otherwise, returns a string of JavaScript that represents
  the component's module.

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

Internally, `svg-react-loader` converts the given SVG/XML into an object tree
that looks something like:

~~~js
{
    "tagname": "svg",
    "props": {
        "xmlns": "http://www.w3.org/2000/svg",
        "xmlns:xlink": "http://www.w3.org/1999/xlink",
        "viewBox": "0 0 16 16",
        "enable-background": "new 0 0 16 16",
        "xml:space": "preserve"
    },
    "children": [
        {
            "tagname": "rect",
            "props": {
                "x": "0",
                "y": "0",
                "width": "16",
                "height": "16",
                "fill": "#fff"
            }
        },
        {
            "tagname": "text",
            "children": ["Foobar"]
        }
    ]
}
~~~

It then uses a variety of [filters](#filters) to modify the tree to conform to
how `React` expects to see props, styles, etc...

If `svg-react-loader` receives a JSON string instead of string of SVG/XML, it
expects to receive it in the above format (i.e.: objects with properties
'tagname', 'props', and 'children'). Children is always an array (unless empty),
and children can be objects with the mentioned props, or a plain string (for
text nodes).

### Filters

A filter is just a function that accepts one value, and it has the same `this`
context as the [traverse](https://www.npmjs.com/package/traverse) API.

`svg-react-loader` is really just a series of filters applied to a parsed
SVG/XML, or JSON, string and then regenerated as a string to form a React
functional component.

Review [lib/sanitize/filters](lib/sanitize/filters) for some examples.

Report an Issue
---------------

* [Bugs](http://github.com/jhamlet/svg-react-loader/issues)
* Contact the author: <jerry@hamletink.com>


License
-------

[MIT](./LICENSE)
