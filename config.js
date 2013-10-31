/**
 * Created by jaussan on 31/10/13.
 */
var ftp = {
    host: "home.jaussoin.com",
    port: 55551,
    username: "Download",
    password: "bellepou",
    remoteSeparator: '/',
    sendDelay: 120,
    timeouts: [5, 30, 60, 60, 600, 600, 600, 3600, 3600]
};

var directories = {
    watchRoot: "c:\\famille",
    remoteRoot: "/Public/Videos/",
    testFile: "c:\\watch\\Movies\\TheMovie\\sub1\\sub2\\blah.txt" // Temporary
};

exports.ftp = ftp;
exports.directories = directories;