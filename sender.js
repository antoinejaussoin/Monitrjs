var ssh2 = require("ssh2");
var fs = require("fs");
var path = require("path");
var config = require("./config");
var queue = require("./queue");
var log = require("./log");

function resolveRemotePath(file, config){
    return path.normalize(file.replace(config.directories.watchRoot, config.directories.remoteRoot));
}

function ensureDirectory(directory, sftp, callback) {
    log.info("About to create directory "+directory);

    var parent =  path.dirname(directory);

    log.info("Going to parent "+parent);

    if (parent.length > 3){
        ensureDirectory(parent, sftp, function(){
            makeDirectory(directory, sftp, callback);
        });
    }
    else
    {
        callback();
    }
}

function makeDirectory(directory, sftp, callback){
    var remoteDirectory = directory.replace(/\\/g, config.ftp.remoteSeparator);
    log.info("Making remote directory "+remoteDirectory);
    sftp.mkdir(remoteDirectory, function(err){
        if (err){ // Probably because the directory already exists
            //log.info("Error: "+err);
            callback(err);
        }else{
            log.warn("Created a directory: "+directory);
            callback(undefined);
        }
    });
}


function requeuing(file, config, tryCount, callback){
    if (config.ftp.timeouts.length > tryCount){
        var waitTime = config.ftp.timeouts[tryCount];

        queue.push('Requeuing file transfer #'+tryCount+", for "+waitTime+" seconds: "+file, waitTime, function(){
            doSend(file, config, tryCount+1, callback);
        });
    }
    else
    {
        log.error("The file "+file+" couldn't be sent. Aborting for good.");
    }

}

function doSend(file, config, tryCount, callback){
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
                var remoteFileChanged = remoteFile.replace(/\\/g, config.ftp.remoteSeparator);
                log.info("Remote file to be sent: "+remoteFileChanged);
                var writeStream = sftp.createWriteStream(remoteFileChanged);

                writeStream.on('close', function(){
                    log.info("File transferred");
                    sftp.end();
                    callback(file, remoteFileChanged);
                });

                writeStream.on('error', function(err){
                    log.error("Re-queuing: "+err);
                    requeuing(file, config, tryCount, callback);
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

function send(file, config, callback) {
    doSend(file, config, 0, callback);
}

exports.send = send;