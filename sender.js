var ssh2 = require("ssh2");
var fs = require("fs");
var path = require("path");

function resolveRemotePath(file, rootPath){
    return file.replace(rootPath, "/Public/");
}

function ensureDirectory(file, sftp, callback) {
    var directory = path.dirname(file);
    console.log("About to create directory "+directory);

    sftp.mkdir(directory, function(err, res){
       if (err){
           console.log("Error: "+err);
       }else{
           console.log("Created a directory: "+res);
       }
        callback();
    });
}

function send(file, rootPath) {
	console.log("Sending "+file);
    var remoteFile = resolveRemotePath(file, rootPath);
    console.log("To "+remoteFile);
	var conn = new ssh2();
	conn.on('connect', function(){
		console.log("connected to SSH");
	});

	conn.on('ready', function(){
		console.log("ready");
		conn.sftp(function(err, sftp){
			if (err){
				console.log("Error, problem starting SFTP: %s", err);
				process.exit(2);
			}

			console.log("SFTP started");

            ensureDirectory(remoteFile, sftp, function(){
                // upload file
                var readStream = fs.createReadStream(file);
                var writeStream = sftp.createWriteStream(remoteFile);

                writeStream.on('close', function(){
                    console.log("File transferred");
                    sftp.end();
                });

                readStream.pipe(writeStream);
            });


		});

	});

	conn.on('error', function(err) {
		console.log("Connection error: %s", err);
	});

	conn.on('end', function() {
		console.log("Connection ended");
	});

	conn.connect({
		host: "192.168.0.66",
		port: 55551,
		username: "Download",
		password: "bellepou",
        hostVerifier: function(a, b){
            return true;
        }
	});
}

exports.send = send;