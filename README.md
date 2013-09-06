# and-stream

Node.js Stream to filter multiple-streams of incoming objects, and only return objects that are present in ALL streams.

[![build status](https://secure.travis-ci.org/eugeneware/and-stream.png)](http://travis-ci.org/eugeneware/and-stream)

## Installation

Install via npm:

```
$ npm install and-stream
```

## Examples

### Only print out objects that are present in two input object streams

``` js
var andStream = require('and-stream');

// No key passed into the factory method, so just uses JSON.stringify for uniqueness
var and = andStream();
and
  .on('data', console.log)
  .on('end', process.exit);

aStreamOfObjects()       // emits objects
  .pipe(and.stream());

anotherStreamOfObjects() // emits objects
  .pipe(and.stream());

// Only objects that are identical and emitted by both streams will be printed

```

The `and-stream` constructor takes an optional argument which is used to
determine the unique key to identify an object by. If not used, it will
default to using `JSON.stringify` to uniquely identify each object, so only
if the exact same object is present on all streams will the objected be
emmitted by the `and-stream`.

### Use the `name` property on the object as the object key

``` js
var andStream = require('and-stream');

// Use the 'name' field as the key for anding object streams
var and = andStream('name');
and
  .on('data', console.log)
  .on('end', process.exit);

aStreamOfObjects()       // emits objects
  .pipe(and.stream());

anotherStreamOfObjects() // emits objects
  .pipe(and.stream());

// Only objects that have the same .name field on both streams will be printed

```

### Use a custom function on the objects to determine the key
``` js
var andStream = require('and-stream');

// Use the 'name' field as the key for anding object streams
var and = andStream(function (data) {
  var strKey = data.name;
  var useKey = new Buffer(strKey, 'utf8').toString('base64');
  return useKey;
});
and
  .on('data', console.log)
  .on('end', process.exit);

aStreamOfObjects()       // emits objects
  .pipe(and.stream());

anotherStreamOfObjects() // emits objects
  .pipe(and.stream());

// Only objects that have the same base64 of the .name field on both streams will be printed

```
