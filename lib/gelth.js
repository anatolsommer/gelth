/*!
 * gelth
 * Copyright(c) 2016 Anatol Sommer <anatol@anatol.at>
 * MIT Licensed
 */
/* globals require,module */
/* jshint strict:global */

'use strict';

var fs=require('fs'), util=require('util'), EE=require('events');

function Gelth(file, opts) {
  var self=this;

  this._file=file;
  this.opts=opts=opts || {};
  opts.separator=opts.separator || '\n';
  opts.lines=(typeof opts.lines!=='undefined' ? opts.lines : 10);
  opts.follow=opts.follow || false;
  opts.interval=opts.interval || 300;
  opts.buffer=opts.buffer || opts.lines*4096 || 32768;

  fs.stat(file, function(err, stat) {
    var start, end;
    if (err) {
      self.emit('error', err);
      return;
    }
    end=stat.size-1;
    start=end-opts.buffer;
    if (opts.lines) {
      read((start>0 ? start : 0), (end>0 ? end : 0), opts.lines);
    }
    if (opts.follow) {
      self._watcher=fs.watchFile(
        file,
        {persistent:true, interval:opts.interval},
        fileWatcher
      );
    }
  });

  function read(start, end, lines) {
    self._stream=fs.createReadStream(file, {start:start, end:end});
    self._stream.on('error', function (err) {
      self.end();
      self.emit('error', err);
    });
    self.emit('reading');
    self._stream.on('data', function(data) {
      var arr, i;
      data=data.toString();
      arr=data.split(opts.separator);
      if (data.lastIndexOf(opts.separator)===data.length-opts.separator.length) {
        arr.pop();
      }
      if (lines>0) {
        arr=arr.splice(-lines);
      }
      for (i=0; i<arr.length; i++) {
        self.emit('data', arr[i]);
      }
    });
  }

  function fileWatcher(cur, prev) {
    var diff=cur.size-prev.size;
    if (diff<0) {
      self.emit('cut');
    } else {
      read(prev.size, cur.size, -1);
    }
  }
}

util.inherits(Gelth, EE);

Gelth.prototype.end=function() {
  if (this.opts.follow && this._watcher) {
    fs.unwatchFile(this._file);
  }
};

module.exports=Gelth;
