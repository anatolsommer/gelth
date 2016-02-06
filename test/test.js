var assert=require('assert'), fs=require('fs'), Gelth=require('..');

describe('Gelth', function() {
  var file;

  this.timeout(2000);
  this._slow=1000;

  before(function(done) {
    var i, text='';
    for (i=0; i<100; i++) {
      text+='Line '+i+'\n';
    }
    fs.writeFile(__dirname+'/test.txt', text, done);
  });

  it('should read 3 lines', function(done) {
    var lines='', cnt=0;
    file=new Gelth(__dirname+'/test.txt', {lines:3});
    file.on('data', function(line) {
      lines+=line+'|';
      if (++cnt>=3) {
        assert.equal(lines, 'Line 97|Line 98|Line 99|');
        done();
      }
    });
  });

  it('should read 3 lines and follow', function(done) {
    var lines='', cnt=0;
    file=new Gelth(__dirname+'/test.txt', {lines:3, follow:true});
    setTimeout(function() {
      fs.appendFile(__dirname+'/test.txt', 'Newline\n');
    }, 800);
    file.on('data', function(line) {
      lines+=line+'|';
      if (++cnt>=4) {
        assert.equal(lines, 'Line 97|Line 98|Line 99|Newline|');
        done();
      }
    });
  });

  it('should emit cut event', function(done) {
    fs.unlink(__dirname+'/test.txt');
    file.on('cut', function() {
      file.end();
      done();
    });
  });

});
