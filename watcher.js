var watchr = require('watchr');
var fs = require("fs");

function watchDirectory(directoryToWatch, onFileCreated){
    watchr.watch({
        path: directoryToWatch,
        listeners: {
            change: function(changeType, filePath, fileCurrentStat, filePreviousStat){
                console.log('A change event occurred: ', arguments);
                if (changeType === 'create') {
                    fs.stat(filePath, function(err, stats){
                        if (stats.isFile()){
                            console.log("This is a file");
                            onFileCreated(filePath);
                        } else {
                            console.log("This is a directory, we ignore it");
                        }
                    });
                }
            }
        }

    });
}

exports.watchDirectory = watchDirectory;