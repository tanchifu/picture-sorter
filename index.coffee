fs = require 'fs-extra'
ExifImage = require('exif').ExifImage
path = require 'path'

pictureSorter = (src, dst, opt) ->
  if fs.existsSync src
    processFolder src, dst, opt
  else
    log opt, 'Error reading source directory.'
  return

processFolder = (src, dst, opt) ->
  files = fs.readdirSync src
  for file in files
    currentFile = "#{src}/#{file}"
    fileStats = fs.statSync currentFile
    if fileStats.isFile()
      fileExt = path.extname(currentFile)
      if fileExt.toLowerCase() in ['.jpg', '.jpeg']
        saveFile currentFile, file, dst, fileStats, opt
    else if fileStats.isDirectory()
      processFolder currentFile, dst, opt

saveFile = (fullFileName, fileName, destFolder, fileStats, opt) ->
  new ExifImage image: fullFileName, (err, data) ->
    unless err
      imageDate = data.exif?.DateTimeOriginal or data.image?.ModifyDate
      if imageDate?
        date = imageDate.replace /\ /g, ':'
        dateArr = date.split ':'
        if dateArr.length > 5
          folder = "#{destFolder}/#{dateArr[0]}/#{dateArr[1]}/#{dateArr[2]}"
          file = "#{dateArr[3]}_#{dateArr[4]}_#{fileName}"
          copyOrMoveFile fullFileName, folder, file, opt['m']?, opt
        else
          log opt, "Error parsing date info. File: #{fileName}"
          useModifDate fullFileName, fileStats.mtime, destFolder, fileName, opt
      else
        log opt, "Error getting date from Exif info. File: #{fileName}"
        useModifDate fullFileName, fileStats.mtime, destFolder, fileName, opt
    else
      log opt, "Error obtaining Exif info. File: #{fileName}"
      useModifDate fullFileName, fileStats.mtime, destFolder, fileName, opt

copyOrMoveFile = (fullFileName, fullPath, fileName, move = false, opt) ->
  fs.mkdirsSync fullPath
  if move
    log opt, "Moving file #{fileName} to #{fullPath}"
    fs.copySync fullFileName, "#{fullPath}/#{fileName}"
    fs.removeSync fullFileName
  else
    log opt, "Copying file #{fileName} to #{fullPath}"
    fs.copySync fullFileName, "#{fullPath}/#{fileName}"

useModifDate = (fullFileName, mtime, destFolder, fileName, opt) ->
  if opt['use-modif-date']?
    log opt, 'Using modification date instead...'
    date = new Date mtime
    year = "#{date.getFullYear()}"
    month = "#{if date.getMonth() + 1 < 10 then '0' else ''}#{date.getMonth() + 1}"
    day = "#{if date.getDate() < 10 then '0' else ''}#{date.getDate()}"
    hours = "#{if date.getHours() < 10 then '0' else ''}#{date.getHours()}"
    minutes = "#{if date.getMinutes() < 10 then '0' else ''}#{date.getMinutes()}"
    folder = "#{destFolder}/#{year}/#{month}/#{day}"
    file = "#{hours}_#{minutes}_#{fileName}"
    copyOrMoveFile fullFileName, folder, file, opt['m']?, opt

log = (opt, msg) ->
  console.log msg if opt['v']?

module.exports = pictureSorter
