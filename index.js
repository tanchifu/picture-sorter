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
    var currentFile, file, fileExt, fileStats, files, i, len, ref, results;
    files = fs.readdirSync(src);
    results = [];
    for (i = 0, len = files.length; i < len; i++) {
      file = files[i];
      currentFile = src + "/" + file;
      fileStats = fs.statSync(currentFile);
      if (fileStats.isFile()) {
        fileExt = path.extname(currentFile);
        if ((ref = fileExt.toLowerCase()) === '.jpg' || ref === '.jpeg') {
          results.push(saveFile(currentFile, file, dest));
        } else {
          results.push(void 0);
        }
      } else if (fileStats.isDirectory()) {
        results.push(processFolder(currentFile, dest));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  saveFile = function(fullFileName, fileName, destFolder) {
    return new ExifImage({
      image: fullFileName
    }, function(err, data) {
      var date, dateArr, file, folder, imageDate, ref, ref1;
      if (!err) {
        imageDate = ((ref = data.exif) != null ? ref.DateTimeOriginal : void 0) || ((ref1 = data.image) != null ? ref1.ModifyDate : void 0);
        if (imageDate != null) {
          date = imageDate.replace(/\ /g, ':');
          dateArr = date.split(':');
          if (dateArr.length > 5) {
            folder = destFolder + "/" + dateArr[0] + "/" + dateArr[1] + "/" + dateArr[2];
            file = dateArr[3] + "_" + dateArr[4] + "_" + fileName;
            fs.mkdirsSync(folder);
            if (this.opt === '--move') {
              fs.copySync(fullFileName, folder + "/" + file);
              return fs.removeSync(fullFileName);
            } else {
              return fs.copySync(fullFileName, folder + "/" + file);
            }
          }
        }
      }
    });
  };

  module.exports = pictureSorter;

}).call(this);
