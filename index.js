(function() {
  var ExifImage, copyOrMoveFile, fs, log, path, pictureSorter, processFolder, saveFile, useModifDate;

  fs = require('fs-extra');

  ExifImage = require('exif').ExifImage;

  path = require('path');

  pictureSorter = function(src, dst, opt) {
    if (fs.existsSync(src)) {
      processFolder(src, dst, opt);
    } else {
      log(opt, 'Error reading source directory.');
    }
  };

  processFolder = function(src, dst, opt) {
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
          results.push(saveFile(currentFile, file, dst, fileStats, opt));
        } else {
          results.push(void 0);
        }
      } else if (fileStats.isDirectory()) {
        results.push(processFolder(currentFile, dst, opt));
      } else {
        results.push(void 0);
      }
    }
    return results;
  };

  saveFile = function(fullFileName, fileName, destFolder, fileStats, opt) {
    console.log(fullFileName);
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
            return copyOrMoveFile(fullFileName, folder, file, opt['m'] != null, opt);
          } else {
            log(opt, "Error parsing date info. File: " + fileName);
            return useModifDate(fullFileName, fileStats.mtime, destFolder, fileName, opt);
          }
        } else {
          log(opt, "Error getting date from Exif info. File: " + fileName);
          return useModifDate(fullFileName, fileStats.mtime, destFolder, fileName, opt);
        }
      } else {
        log(opt, "Error obtaining Exif info. File: " + fileName);
        return useModifDate(fullFileName, fileStats.mtime, destFolder, fileName, opt);
      }
    });
  };

  copyOrMoveFile = function(fullFileName, fullPath, fileName, move, opt) {
    if (move == null) {
      move = false;
    }
    fs.mkdirsSync(fullPath);
    if (move) {
      log(opt, "Moving file " + fileName + " to " + fullPath);
      fs.copySync(fullFileName, fullPath + "/" + fileName);
      return fs.removeSync(fullFileName);
    } else {
      log(opt, "Copying file " + fileName + " to " + fullPath);
      return fs.copySync(fullFileName, fullPath + "/" + fileName);
    }
  };

  useModifDate = function(fullFileName, mtime, destFolder, fileName, opt) {
    var date, day, file, folder, hours, minutes, month, year;
    if (opt['use-modif-date'] != null) {
      log(opt, 'Using modification date instead...');
      date = new Date(mtime);
      year = "" + (date.getFullYear());
      month = "" + (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
      day = "" + (date.getDate() < 10 ? '0' : '') + (date.getDate());
      hours = "" + (date.getHours() < 10 ? '0' : '') + (date.getHours());
      minutes = "" + (date.getMinutes() < 10 ? '0' : '') + (date.getMinutes());
      folder = destFolder + "/" + year + "/" + month + "/" + day;
      file = hours + "_" + minutes + "_" + fileName;
      return copyOrMoveFile(fullFileName, folder, file, opt['m'] != null, opt);
    }
  };

  log = function(opt, msg) {
    if (opt['v'] != null) {
      return console.log(msg);
    }
  };

  module.exports = pictureSorter;

}).call(this);
