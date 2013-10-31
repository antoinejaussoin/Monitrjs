var watcher = require('./watcher');
var sender = require("./sender");
var config = require("./config");
var queue = require("./queue");
var log = require("./log");

var directoryToWatch = config.directories.watchRoot;

queue.start();

watcher.watchDirectory(directoryToWatch, function(createdFile){
    queue.push("Sending "+createdFile, 10, function(){
        sender.send(createdFile, config);
    });
});

log.info("Watching started");

//sender.send(config.directories.testFile, config.directories.watchRoot);