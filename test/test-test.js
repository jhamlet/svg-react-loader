/*globals describe, it*/
var react  = require('react');
var loader = require('../');
var babel  = require('babel-core');
var fs     = require('fs');
var path   = require('path');
var _      = require('lodash');
var assign = _.assign;

var defaultMock = {
    callback:       function (error, result) {
        if (error) {
            throw error;
        }
        console.log(result);
    },
    cacheable:      function () {},
    addDependency:  function () {},
    query:          '?reactDOM=react',
    resourcePath:   'foo.svg'
    // resourceQuery:  '?tag=symbol&name=AdvantageIcon&attrs={foo:\'bar\'}'
};

require('should');

function invoke (xml, mock) {
    var context = assign({}, defaultMock, mock || {});
    context.async = function () { return this.callback; }.bind(context);
    loader.call(context, xml);
}

function read (filepath) {
    return fs.readFileSync(path.join(__dirname, filepath), 'utf8');
}

describe('svg-react-loader', function () {
    it('should return a function', function () {
        loader.should.be.a.function;
    });

    it('should do something', function (done) {
        // var filename = 'ffg-sw-advantage.svg';
        var filename = './svg/mashup.svg';
        invoke(read(filename), {
            callback: function (error, result) {
                if (error) {
                    throw error;
                }

                console.log(babel.transform(result, {
                    presets: ['es2015', 'react']
                }).code);
                done();
            },
            query: '?reactDom=react',
            resourcePath: filename,
            resourceQuery: '?tag=foo&attrs={foo: \'bar\'}'
        });
    });

    it('should handle styles', function (done) {
        var filename = './svg/styles.svg';

        invoke(read(filename), {
            callback: function (error, result) {
                if (error) {
                    throw error;
                }

                var src = babel.transform(result, {
                    presets: ['es2015', 'react']
                }).code;
                console.log(src);
                fs.writeFileSync(__dirname + '/temp', src);
                var el = react.createElement(require(__dirname + '/temp'));
                var html = react.renderToStaticMarkup(el);

                // var el = react.createElement('style');
                // var html = react.renderToStaticMarkup(el);

                console.log(html);
                fs.unlink(__dirname + '/temp');
                done();
            },
            resourcePath: filename
        });
    });

    it('should handle text elements', function (done) {
        var filename = './svg/text.svg';

        invoke(read(filename), {
            callback: function (error, result) {
                if (error) {
                    throw error;
                }

                var src = babel.transform(result, {
                    presets: ['es2015', 'react']
                }).code;
                console.log(src);
                fs.writeFileSync(__dirname + '/temp', src);
                var el = react.createElement(require(__dirname + '/temp'));
                var html = react.renderToStaticMarkup(el);

                // var el = react.createElement('style');
                // var html = react.renderToStaticMarkup(el);

                console.log(html);
                fs.unlink(__dirname + '/temp');
                done();
            },
            resourcePath: filename
        });
    });

    it('json query', function (done) {
        var filename = './svg/text.svg';

        invoke(read(filename), {
            callback: function (/*error, result*/) {
                done();
            },
            query: '?' + JSON.stringify({
                attrs: {
                    style: {},
                    width: 'auto',
                    height: 'auto'
                }
            }),
            resourceQuery: '?' + JSON.stringify({
                attrs: {
                    style: {},
                    width: 'auto',
                    height: 'auto'
                }
            })
        });
    });
});
