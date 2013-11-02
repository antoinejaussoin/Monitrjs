/**
 * Created by Antoine on 02/11/2013.
 */
var opensubtitles = require("opensubtitles-client");
var log = require("./log");
var path = require("path");
var queue = require("./queue");
var config = require("./config");

function download(file, language){
    log.info("Downloading subtitles for "+file);
    log.info("sub client: "+opensubtitles);

    // Calculating SRT name
    var subFile = path.resolve(file);
    var extension = path.extname(subFile);
    var directory = path.dirname(subFile);
    var fileName = path.basename(subFile, extension);

    var finalSubFile = directory+path.sep+fileName+"."+language+extension;

    downloadSubs(file, language, finalSubFile, 0);
}

function downloadSubs(movieFile, language, subFile, attempt) {

    if (attempt>10){
        log.error("Giving up on finding a sub for "+movieFile+" in "+language);
        return;
    }

    opensubtitles.api.on('error', function(err){
        log.error("An error occurred within the subtitle API: "+err);
    });

    opensubtitles.api.login()
        .done(function(token){
            log.info("Logged in OpenSubtitles API token "+token);
            opensubtitles.api.searchForFile(token, language, movieFile)
                .done(
                function(results){
                    log.info("Got some results: "+results.length);

                    if (results.length == 0){
                        log.info("Didn't find any subtitle for "+movieFile+", attempt "+attempt);
                        log.info("Requeuing for "+config.subtitles.retryDelay+" seconds");
                        queue.push("Subtitle for "+movieFile+" in "+language, config.subtitles.retryDelay, function(){
                           downloadSubs(movieFile, language, subFile, attempt+1);
                        });
                        opensubtitles.api.logout(token);
                    }
                    else
                    {
                        opensubtitles.downloader.download(results, 100, subFile, function(){
                            log.info("Download the fricking files");
                            opensubtitles.api.logout(token);
                        });
                    }
                }
            );
        });
}




exports.download = download;