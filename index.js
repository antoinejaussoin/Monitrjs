var watcher = require('./watcher');
var sender = require("./sender");
var config = require("./config");
var queue = require("./queue");

var directoryToWatch = config.directories.watchRoot;

queue.start();

watcher.watchDirectory(directoryToWatch, function(createdFile){
    queue.push("Sending "+createdFile, 2, function(){
        sender.send(createdFile, directoryToWatch);
    });
});

console.log("Watching started");

//sender.send(config.directories.testFile, config.directories.watchRoot);