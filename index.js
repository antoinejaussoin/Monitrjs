var watcher = require('./watcher');
var sender = require("./sender");
var config = require("./config").config;
var queue = require("./queue");
var log = require("./log");
var growlr = require("./growlr");
var subtitler = require("./subtitler");
var path = require("path");
var tweet = require("./tweet");

process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
  log.info("Caught exception: "+err);
});

log.info("Welcome to MonitrJS");
log.info(config.ftp.host);

var directoryToWatch = config.directories.watchRoot;

queue.start();


function fileSent(file, remoteFile){
    var extension = path.extname(file);
    var movieExtensions = config.subtitles.movieExtensions;
    if (movieExtensions.indexOf(extension) > -1) {
        growlr('File transferred', remoteFile);
    }
}


watcher.watchDirectory(directoryToWatch, function(createdFile){
    queue.push("Sending "+createdFile, config.ftp.sendDelay, function(done){
        sender.send(createdFile, config, fileSent, done);
    });

    var fileExtension = path.extname(createdFile);
    var fileName = path.basename(createdFile, fileExtension);
    var movieExtensions = config.subtitles.movieExtensions;
    if (movieExtensions.indexOf(fileExtension) > -1) {
        tweet.send("New movie! "+fileName);

        queue.push("Finding subs for "+createdFile, config.subtitles.initialDelay, function(done){
            config.subtitles.languages.forEach(function(language){
                subtitler.download(createdFile, language, done);
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