/**
 * Created by jaussan on 31/10/13.
 */
var ftp = {
    host: "localhost",
    port: 22,
    username: "Download",
    password: "bellepou"
};

var directories = {
    watchRoot: "c:\\watch",
    remoteRoot: "/Public/",
    testFile: "c:\\watch\\Movies\\TheMovie\\sub1\\sub2\\blah.txt" // Temporary
};

exports.ftp = ftp;
exports.directories = directories;