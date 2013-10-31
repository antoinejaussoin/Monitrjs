var watcher = require('./watcher');
var sender = require("./sender");
var config = require("./config");

var directoryToWatch = config.directories.watchRoot;

watcher.run(directoryToWatch, function(createdFile){
    sender.send(createdFile, directoryToWatch);
});

console.log("Watching started");

//sender.send(config.directories.testFile, config.directories.watchRoot);