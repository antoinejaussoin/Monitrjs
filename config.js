/**
 * Created by jaussan on 31/10/13.
 */
var ftp = {
    host: "www.host.com",
    port: 55551,
    username: "Download",
    password: "somepass",
    remoteSeparator: '/',
    sendDelay: 30,
    timeouts: [5, 30, 60, 60, 600, 600, 600, 3600, 3600]
};

var directories = {
    watchRoot: "/Users/Antoine/watch/",
    remoteRoot: "/Public/Videos/"
};

var subtitles = {
    retryDelay: 24 * 60 * 60, // Retry delay in seconds (24 hours)
    //retryDelay: 5,
    initialDelay: 30,
    movieExtensions: [".mkv", ".avi", ".mp4", ".mov"],
    languages: ["eng", "fre"]
}

exports.ftp = ftp;
exports.directories = directories;
exports.subtitles = subtitles;