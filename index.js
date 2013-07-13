var Stream = require('stream');

module.exports = and;
function and() {
  var s = new Stream;
  s.readable = true;
  s.writable = true;

  var pipes = 0;

  s.write = function (data) {
    s.emit('data', data);
  };

  var ended = 0;
  s.end = function (data) {
    if (arguments.length) s.write(data);
    ended++;
    if (pipes == ended) {
      s.writable = false;
      s.emit('end');
    }
  };

  s.destroy = function () {
    s.writable = false;
  };

  s.on('pipe', function () {
    pipes++;
  });

  s.on('unpipe', function () {
    pipes--;
  });

  return s;
}
