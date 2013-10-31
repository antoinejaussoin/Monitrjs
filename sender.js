var ssh2 = require("ssh2");
var fs = require("fs");
var path = require("path");
var config = require("./config");
var queue = require("./queue");
var log = require("./log");

var timeouts = [5, 30, 60, 60, 600, 600, 600, 3600, 3600];
//var timeouts = [1, 2, 1, 2, 1, 2, 1, 2, 1];

function resolveRemotePath(file, config){
    return path.normalize(file.replace(config.directories.watchRoot, config.directories.remoteRoot));
}

function ensureDirectory(directory, sftp, callback) {
    log.info("About to create directory "+directory);

    var parent =  path.dirname(directory);

    log.info("Going to parent "+parent);

    if (parent.length > 3){
        ensureDirectory(parent, sftp, function(){
            log.info("Making directory "+directory);
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
        if (err){ // Probably because the directory already exists
            //log.info("Error: "+err);
            callback(err);
        }else{
            log.warn("Created a directory: "+directory);
            callback(undefined);
        }
    });
}


function requeuing(file, config, tryCount){
    if (timeouts.length > tryCount){
        var waitTime = timeouts[tryCount];

        queue.push('Requeuing file transfer #'+tryCount+", for "+waitTime+" seconds: "+file, waitTime, function(){
            doSend(file, config, tryCount+1);
        });
    }
    else
    {
        log.error("The file "+file+" couldn't be sent. Aborting for good.");
    }

}

function doSend(file, config, tryCount){
    log.info("Sending "+file);
    var remoteFile = resolveRemotePath(file, config);
    log.info("To "+remoteFile);

    var conn = new ssh2();

    conn.on('connect', function(){
        log.info("connected to SSH");
    });

    conn.on('ready', function(){
        log.info("ready");
        conn.sftp(function(err, sftp){
            if (err){
                log.error("Error, problem starting SFTP: %s", err);
                process.exit(2);
            }

            log.info("SFTP started");
            var remoteDirectory = path.dirname(remoteFile);

            ensureDirectory(remoteDirectory, sftp, function(){
                // upload file
                var readStream = fs.createReadStream(file);
                var writeStream = sftp.createWriteStream(remoteFile);

                writeStream.on('close', function(){
                    log.info("File transferred");
                    sftp.end();
                });

                writeStream.on('error', function(){
                    log.error("Re-queuing");
                    requeuing(file, config, tryCount);
                    sftp.end();
                });

                readStream.pipe(writeStream);
            });


        });

    });

    conn.on('error', function(err) {
        log.error("Connection error: %s", err);
        log.error("Re-queuing");
        requeuing(file, rootPath, tryCount);
    });

    conn.on('end', function() {
        log.info("Connection ended");
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

function send(file, config) {
	doSend(file, config, 0);
}

exports.send = send;