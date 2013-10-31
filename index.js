var watcher = require('./watcher');
var sender = require("./sender");
var config = require("./config");
var queue = require("./queue");
var log = require("./log");
var growlr = require("./growlr");

var directoryToWatch = config.directories.watchRoot;

queue.start();

watcher.watchDirectory(directoryToWatch, function(createdFile){
    queue.push("Sending "+createdFile, config.ftp.sendDelay, function(){
        sender.send(createdFile, config);
    });
});

log.info("Watching started");

growlr('MonitrJS Started!', 'It should start monitoring now...');

//sender.send(config.directories.testFile, config.directories.watchRoot);