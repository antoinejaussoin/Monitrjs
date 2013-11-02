var watcher = require('./watcher');
var sender = require("./sender");
var config = require("./config");
var queue = require("./queue");
var log = require("./log");
var growlr = require("./growlr");
var subtitler = require("./subtitler");
var path = require("path");

var directoryToWatch = config.directories.watchRoot;

queue.start();

watcher.watchDirectory(directoryToWatch, function(createdFile){
    queue.push("Sending "+createdFile, config.ftp.sendDelay, function(){
        sender.send(createdFile, config);
    });

    var fileExtension = path.extname(createdFile);
    var movieExtensions = config.subtitles.movieExtensions;
    if (movieExtensions.indexOf(fileExtension) > -1) {
        queue.push("Finding subs for "+createdFile, config.subtitles.initialDelay, function(){
            config.subtitles.languages.forEach(function(language){
                subtitler.download(createdFile, language);
            });
        });
    }
    else
    {
        log.info("The new file is not a movie, ignoring for subtitles "+createdFile);
    }
});

log.info("Watching started");

growlr('MonitrJS Started!', 'It should start monitoring now...');

//subtitler.download("/Users/Antoine/watch/Series/The Good Wife - s01e01 - Pilot.mkv", "eng");
//subtitler.download("/Users/Antoine/watch/Series/The Good Wife - s01e01 - Pilot.mkv", "fre");
//subtitler.download("/Users/Antoine/watch/Series/Under the dome - s01e01 - Pilot.mkv", "eng");

//sender.send(config.directories.testFile, config.directories.watchRoot);