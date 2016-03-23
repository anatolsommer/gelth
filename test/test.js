var assert=require('assert'), fs=require('fs'), Gelth=require('..');

describe('Gelth', function() {
  var file;

  this.timeout(1000);
  this._slow=500;

  before(function(done) {
    fs.unlink(__dirname+'/test.txt', function() {
      done();
    });
  });

  it('should read and emit 3 lines', function(done) {
    var text='', lines='', cnt=0, i;
    for (i=0; i<100; i++) {
      text+='Line '+i+'\n';
    }
    fs.writeFileSync(__dirname+'/test.txt', text);
    file=new Gelth(__dirname+'/test.txt', {lines:3});
    file.on('data', function(line) {
      lines+=line+'|';
      if (++cnt>=3) {
        assert.equal(lines, 'Line 97|Line 98|Line 99|');
        done();
      }
    });
  });

  it('should read 2 lines and follow', function(done) {
    var lines='', cnt=0;
    file=new Gelth(__dirname+'/test.txt', {lines:2, follow:true});
    setTimeout(function() {
      fs.appendFile(__dirname+'/test.txt', 'Newline');
    }, 100);
    file.on('data', function(line) {
      lines+=line+'|';
      if (++cnt>=3) {
        assert.equal(lines, 'Line 98|Line 99|Newline|');
        done();
      }
    });
  });

  it('should emit "reading" event', function(done) {
    file=new Gelth(__dirname+'/test.txt', {lines:3, follow:true});
    file.on('reading', function(line) {
      done();
    });
  });

  it('should emit cut event', function(done) {
    fs.unlink(__dirname+'/test.txt');
    file.on('cut', function() {
      file.end();
      done();
    });
  });

  it('should emit error from stream', function(done) {
    file.on('error', function() {
      done();
    });
    file._stream.emit('error');
  });

  it('should emit error if file does not exist', function(done) {
    file=new Gelth(__dirname+'/test.txt');
    file.on('error', function(err) {
      file.end();
      done();
    });
  });

  it('should use default buffer size', function() {
    file=new Gelth(__filename, {lines:0});
    assert.equal(file.opts.buffer, 32768);
  });

});
