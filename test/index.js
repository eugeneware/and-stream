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
      process.nextTick(function () {
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
        process.nextTick(function () {
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
      })
      .on('end', function () {
        expect(n).to.equal(10);
        done();
      });

    makeStream('a').pipe(as.stream());
    makeStream('a').pipe(as.stream());
    makeStream('a').pipe(as.stream());
  });

  it('should be able to join based on a property', function(done) {
    var as = and('number');
    var n = 0;
    as
      .on('data', function (data) {
        n++;
      })
      .on('end', function () {
        expect(n).to.equal(10);
        done();
      });

    makeStream('a').pipe(as.stream());
    makeStream('a').pipe(as.stream());
    makeStream('a').pipe(as.stream());
  });

  it('should be able to join based on a function', function(done) {
    var as = and(function (data) {
      var b = new Buffer(data.name, 'utf8');
      return b.toString('base64');
    });
    var n = 0;
    as
      .on('data', function (data) {
        n++;
      })
      .on('end', function () {
        expect(n).to.equal(10);
        done();
      });

    makeStream('a').pipe(as.stream());
    makeStream('a').pipe(as.stream());
    makeStream('a').pipe(as.stream());
  });
});
