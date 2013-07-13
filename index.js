var Stream = require('stream')
  , util = require('util');

function prop(propName) {
  return function (data) {
    return data[propName];
  };
}

function AndStream(propName) {
  var keyfn = JSON.stringify;
  if (typeof propName === 'string') {
    keyfn = prop(propName);
  } else if (typeof propName === 'function') {
    keyfn = propName;
  }

  this.keyfn = keyfn;
  this.registry = {};
  this.writable = false;
  this.readable = true;
  this.streams = 0;
  this.ended = 0;
}

util.inherits(AndStream, Stream);

AndStream.prototype.stream = function () {
  return makeStream(this);
};

module.exports = and;
function and(propName) {
  return new AndStream(propName);
}

function makeStream(andStream) {
  var s = new Stream();
  s.readable = false;
  s.writable = true;

  s.write = function (data) {
    var key = andStream.keyfn(data);
    if (andStream.registry[key] === undefined) {
      andStream.registry[key] = 1;
    } else {
      andStream.registry[key]++;
    }
    if (andStream.registry[key] === andStream.streams) {
      andStream.emit('data', data);
    }
  };

  s.end = function (data) {
    if (arguments.length) s.write(data);
    s.writable = false;

    andStream.ended++;
    if (andStream.ended === andStream.streams) {
      andStream.emit('end');
      andStream.readable = false;
    }
  };

  s.destroy = function () {
    s.writable = false;
  };

  andStream.streams++;
  return s;
}
