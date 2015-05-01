# Picture Sorter

Sort your photos based on their EXIF information. Heavily inspired on [photo-saver](https://github.com/montanaflynn/photo-saver)

## Usage
The main app takes these args:

  * ```-s <SOURCE>``` source folder
  * ```-d <DEST>``` destination folder
  * ```-m``` move files after processing
  * ```-v``` use verbose mode
  * ```--use-modif-date``` use modification date from file if getting Exif info fails



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
│       └── 19
│           └── 04-19-2005.jpg
├── 2006
│   ├── 07
│   │   └── 15
│   │       ├── H020.jpg
│   │       └── H034.jpg
│   └── 11
│       ├── 06
...
```
## Disclaimer
**WARNING**: Use this tool at your own discretion and total responsability, as this app can **wipe out** your whole history of pictures. You've been warned, don't cry later.
