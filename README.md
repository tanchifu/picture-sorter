# Picture Sorter

Sort your photos based on their EXIF information. Heavily inpired on [photo-saver](https://github.com/montanaflynn/photo-saver)

## Usage
The main app takes 3 args: *source* folder, *destination* folder and *options*. The currently supported option is just **--move**, which deletes the processed picture after copying it to the destination folder.

Ex.:

```bash
$ ./picture-sorter /path/to/source/folder /path/to/destination/folder --move
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
