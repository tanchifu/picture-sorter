fs = require 'fs-extra'
ExifImage = require('exif').ExifImage;
path = require 'path'

pictureSorter = (src, dest, @opt) ->
  if fs.existsSync src
    processFolder src, dest
  else
    console.log "Error reading source directory."
  return

processFolder = (src, dest) ->
  files = fs.readdirSync src
  for file in files
    currentFile = "#{src}/#{file}"
    fileStats = fs.statSync currentFile
    if fileStats.isFile()
      fileExt = path.extname(currentFile)
      if fileExt.toLowerCase() in ['.jpg', '.jpeg']
        saveFile currentFile, file, dest
    else if fileStats.isDirectory()
      processFolder currentFile, dest

saveFile = (fullFileName, fileName, destFolder) ->
  new ExifImage image: fullFileName, (err, data) ->
    if not err
      imageDate = data.exif?.DateTimeOriginal or data.image?.ModifyDate
      if imageDate?
        date = imageDate.replace /\ /g, ':'
        dateArr = date.split ':'
        if dateArr.length > 5
          folder = "#{destFolder}/#{dateArr[0]}/#{dateArr[1]}/#{dateArr[2]}"
          file = "#{dateArr[3]}_#{dateArr[4]}_#{fileName}"
          fs.mkdirsSync folder
          if @opt is '--move'
            fs.copySync fullFileName, "#{folder}/#{file}"
            fs.removeSync fullFileName
          else
            fs.copySync fullFileName, "#{folder}/#{file}"


module.exports = pictureSorter
