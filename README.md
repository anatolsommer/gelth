# Gelth
tail -f and -n


## Usage:
`npm install gelth`

```js
var Gelth=require('gelth'), file=new Gelth('./test.txt', {lines:22});

file.on('data', function(line) {
  console.log(line);
});

file.on('error', function(error) {
  console.error(error);
});
```

```js
var Gelth=require('gelth'), file=new Gelth('./test.txt', {follow:true});

file.on('data', function(line) {
  console.log(line);
});

file.on('error', function(error) {
  console.error(error);
});

file.on('cut', function() {
  console.log('File was cut');
});

setTimeout(function() {
  file.end();
}, 3000);
```

### Options:
* `lines`: (Number or `false`), default=`10`
* `follow`: (Boolean), default=`false`
* `separator`: (String), default=`'\n'`
* `interval`: (Number), milliseconds, default=`300`
* `buffer`: (Number), bytes, default=`lines*4096` or `32768`

### Events:
* `data` (String line)
* `error` (Error error)
* `reading`
* `cut`

### Methods:
* `end`


## Tests
Run tests with `npm test` or generate coverage reports with `npm run test-cov`.


## License
#### MIT

