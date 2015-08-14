SVG to React Loader
===================

> A Webpack Loader to turn SVGs into React Components


Summary
-------

A wepack loader allowing for inline usage of a SVG as a React component, or for composing individual SVGs into larger ones.

Handles namespaced attributes (xlink) on component mounting, so the returned `jsx` will compile cleanly with `babel`.

Installation
------------

~~~
% npm install svg-react-loader
~~~


Usage
-----

~~~js
var React = require('react');
var Icon = require('babel!xml-react!../svg/my-icon.svg?name=Icon');

module.exports = React.createClass({
    render () {
        return <Icon className='normal' />;
    }
});
~~~

Documentation
-------------

### Query Params

Query params can be used on the loader path, or on the resource's path. Those on the resource will override those given for the loader.

`name`: `displayName` to use for the compiled component. Defaults to using the resource's file name, capitalized and camelCased. ex. `"?name=MyIcon"`

`tag`: Override the root-level tag. If given, will blow-away any attributes given for the tag. ex.: `"?tag=symbol"`

`attrs`: Attributes to apply to the root-level tag. If a certain attribute is already assigned to the tag, the value here will override that. ex.: `"?attrs={className: 'mySymbol'}"`

Report an Issue
---------------

* [Bugs](http://github.com/jhamlet/svg-react-loader/issues)
* Contact the author: <jerry@hamletink.com>


License
-------

> Copyright (c) 2015 Jerry Hamlet <jerry@hamletink.com>
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
