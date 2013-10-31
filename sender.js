var ssh2 = require("ssh2");
var fs = require("fs");
var path = require("path");
var config = require("./config");

function resolveRemotePath(file, rootPath){
    return path.normalize(file.replace(rootPath, "/Public/"));
}

function ensureDirectory(directory, sftp, callback) {
    console.log("About to create directory "+directory);

    var parent =  path.dirname(directory);

    console.log("Going to parent "+parent);

    if (parent.length > 3){
        ensureDirectory(parent, sftp, function(){
            console.log("Making directory "+directory);
           makeDirectory(directory, sftp, callback);
        });
    }
    else
    {
        callback();
    }
}

function makeDirectory(directory, sftp, callback){
    sftp.mkdir(directory, function(err){
        if (err){
            console.log("Error: "+err);
            callback(err);
        }else{
            console.log("Created a directory: "+directory);
            callback(undefined);
        }
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
            var remoteDirectory = path.dirname(remoteFile);

            ensureDirectory(remoteDirectory, sftp, function(){
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
		host: config.ftp.host,
		port: config.ftp.port,
		username: config.ftp.username,
		password: config.ftp.password,
        hostVerifier: function(a, b){
            return true;
        }
	});
}

exports.send = send;