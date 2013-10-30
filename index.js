var watchr = require('watchr');
var sender = require("./sender");
var rootFolder = "/Users/Antoine/watch/";

watchr.watch({
	path: rootFolder,
	listeners: {
		change: function(changeType, filePath, fileCurrentStat, filePreviousStat){
			console.log("A change event occured: ", arguments);
			if (changeType === 'create') {
				sender.send(filePath, rootFolder);
			}
		}
	}

});

console.log("Watching started");

sender.send("/Users/Antoine/watch/Movies/movie.mkv", rootFolder);