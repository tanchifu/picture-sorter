(function() {
  var ExifImage, fs, path, pictureSorter, processFolder, saveFile;

  fs = require('fs-extra');

  ExifImage = require('exif').ExifImage;

  path = require('path');

  pictureSorter = function(src, dest, opt) {
    this.opt = opt;
    if (fs.existsSync(src)) {
      processFolder(src, dest);
    } else {
      console.log("Error reading source directory.");
    }
  };

  processFolder = function(src, dest) {
    var currentFile, file, fileExt, fileStats, files, _i, _len, _ref, _results;
    files = fs.readdirSync(src);
    _results = [];
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      currentFile = "" + src + "/" + file;
      fileStats = fs.statSync(currentFile);
      if (fileStats.isFile()) {
        fileExt = path.extname(currentFile);
        if ((_ref = fileExt.toLowerCase()) === '.jpg' || _ref === '.jpeg') {
          _results.push(saveFile(currentFile, file, dest));
        } else {
          _results.push(void 0);
        }
      } else if (fileStats.isDirectory()) {
        _results.push(processFolder(currentFile, dest));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  saveFile = function(fullFileName, fileName, destFolder) {
    return new ExifImage({
      image: fullFileName
    }, function(err, data) {
      var date, dateArr, file, folder, imageDate, _ref, _ref1;
      if (!err) {
        imageDate = ((_ref = data.exif) != null ? _ref.DateTimeOriginal : void 0) || ((_ref1 = data.image) != null ? _ref1.ModifyDate : void 0);
        if (imageDate != null) {
          date = imageDate.replace(/\ /g, ':');
          dateArr = date.split(':');
          if (dateArr.length > 5) {
            folder = "" + destFolder + "/" + dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2];
            file = "" + dateArr[3] + "_" + dateArr[4] + "_" + fileName;
            fs.mkdirsSync(folder);
            if (this.opt === '--move') {
              fs.copySync(fullFileName, "" + folder + "/" + file);
              return fs.removeSync(fullFileName);
            } else {
              return fs.copySync(fullFileName, "" + folder + "/" + file);
            }
          }
        }
      }
    });
  };

  module.exports = pictureSorter;

}).call(this);
