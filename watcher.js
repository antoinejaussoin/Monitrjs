var watchr = require('watchr');
var fs = require("fs");
var log = require("./log");

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
                            log.info("This is a directory, we ignore it");
                        }
                    });
                }
            }
        }

    });
}

exports.watchDirectory = watchDirectory;