var watchr = require('watchr');
var fs = require("fs");
var log = require("./log");
var path = require("path");
var walk = require("walk");

function watchDirectory(directoryToWatch, onFileCreated){
    watchr.watch({
        path: directoryToWatch,
        listeners: {
            change: function(changeType, filePath, fileCurrentStat, filePreviousStat){
                log.info('A change event occurred: ', arguments);
                if (changeType === 'create') {
                    fs.stat(filePath, function(err, stats){
                        if (stats.isFile()){
                            log.info("This is a file");
                            onFileCreated(filePath);
                        } else {
                            log.info("This is a directory, we try to find individual files");

                            var walker  = walk.walk(filePath, { followLinks: false });

                            walker.on('file', function(root, stat, next) {
                                onFileCreated(root+path.sep+stat.name);
                                next();
                            });
                        }
                    });
                }
            }
        }

    });
}

exports.watchDirectory = watchDirectory;