var expect = require('chai').expect
  , Stream = require('stream')
  , after = require('after')
  , and = require('..');

describe('and-stream', function() {
  function makeStream(type) {
    var s = new Stream();
    s.readable = true;

    var n = 10;
    var next = after(n, function () {
      setImmediate(function () {
        s.emit('end');
      });
    });

    for (var i = 0; i < n; i++) {
      var o = {
        type: type,
        name: 'name ' + i,
        number: i * 10
      };

      (function (o) {
        setImmediate(function () {
          s.emit('data', o);
          next();
        });
      })(o);
    }
    return s;
  }

  it('should be able to join multiple streams of objects together', function(done) {
    var as = and();
    var n = 0;
    as
      .on('data', function (data) {
        n++;
        console.log(data);
      })
      .on('end', function () {
        expect(n).to.equal(10);
        done();
      });

    makeStream('a').pipe(as);
    makeStream('a').pipe(as);
    makeStream('a').pipe(as);
  });
});
