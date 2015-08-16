/*globals describe, it*/
var loader = require('svg-react-loader');
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
    query:          '',
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

describe('something', function () {
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

                console.log(babel.transform(result).code);
                done();
            },
            resourcePath: filename
            // resourceQuery: '?tag=foo&attrs={foo: \'bar\'}'
        });
    });
});
