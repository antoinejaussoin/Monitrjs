var watcher = require('./watcher');
var sender = require("./sender");
var config = require("./config");
var queue = require("./queue");
var log = require("./log");
var growl = require("growl");

var directoryToWatch = config.directories.watchRoot;

queue.start();

watcher.watchDirectory(directoryToWatch, function(createdFile){
    queue.push("Sending "+createdFile, config.ftp.sendDelay, function(){
        sender.send(createdFile, config);
    });
});

log.info("Watching started");

growl('MonitrJS Started!');

//sender.send(config.directories.testFile, config.directories.watchRoot);