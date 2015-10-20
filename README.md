# Picture Sorter

[![NPM](https://nodei.co/npm/picture-sorter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/picture-sorter/)

Sort your photos based on their EXIF information. Heavily inspired on [photo-saver](https://github.com/montanaflynn/photo-saver)

## Usage
The main app takes these args:

  * ```-s <SOURCE>``` source folder
  * ```-d <DEST>``` destination folder
  * ```-m``` move files after processing
  * ```-v``` use verbose mode
  * ```-j <META-FILE>``` write the meta info of all the picture/video files under the source folder to the meta-file
  * ```--backup``` copy the picture/video files from source to destination without renaming the files
  * ```--report``` report the number of typed files by camera model and file extensions



Ex.:

```bash
$ ./picture-sorter -m -v -s /path/to/source/folder -d /path/to/destination/folder
```

Output structure:

```bash
$ tree /path/to/destination/folder
.
├── 2005
│   └── 04
│       └── 2005-04-19-12-20-30.jpg
│           
├── 2006
│   ├── 07
│   │    ├── 2006-07-12-15-30-21.jpg
│   │    └── 2006-07-12-15-31-09.jpg
│   └── 11
│        ├── 
...
```
## Disclaimer
**WARNING**: Use this tool at your own discretion and total responsability, as this app can **wipe out** your whole history of pictures. You've been warned, don't cry later.
