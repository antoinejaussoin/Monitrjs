/**
 * Created by jaussan on 31/10/13.
 */

var nconf = require("nconf");

//
// 1. any overrides
//
nconf.overrides({
    'always': 'be this value'
});

//
// 2. `process.env`
// 3. `process.argv`
//
nconf.env().argv();

//
// 4. Values in `config.json`
//
nconf.file('config.json');

//
// 5. Any default values
//
nconf.defaults({
    "ftp": {
        "host": "localhost",
        "port": 22,
        "username": "Download",
        "password": "password",
        "remoteSeparator": "/",
        "sendDelay": 3,
        "timeouts": [
            5,
            30,
            60,
            60,
            600,
            600,
            600,
            3600,
            3600
        ]
    },
    "directories": {
        "watchRoot": "c:\\watch",
        "remoteRoot": "/Public/"
    },
    "subtitles": {
        "retryDelay": 86400,
        "initialDelay": 30,
        "movieExtensions": [
            ".mkv",
            ".avi",
            ".mp4",
            ".mov"
        ],
        "languages": [
            "eng",
            "fre"
        ]
    },
    "twitter": {
        "consumer_key": "",
        "consumer_secret": "",
        "access_token_key": "",
        "access_token_secret": ""
    }
});


//
//nconf.set("ftp:host", "localhost");
//nconf.set("ftp:port", 55551);
//nconf.set("ftp:username", "localhost");
//nconf.set("ftp:password", "bellepou");
//nconf.set("ftp:remoteSeparator", "/");
//nconf.set("ftp:sendDelay", 3);
//nconf.set("ftp:timeouts", [5, 30, 60, 60, 600, 600, 600, 3600, 3600]);
//
//nconf.set("directories:watchRoot", "c:\\perso\\data\\watch");
//nconf.set("directories:remoteRoot", "/Public/Videos/");
//
//nconf.set("subtitles:retryDelay", 24 * 60 * 60);
//nconf.set("subtitles:initialDelay", 30);
//nconf.set("subtitles:movieExtensions", [".mkv", ".avi", ".mp4", ".mov"]);
//nconf.set("subtitles:languages", ["eng", "fre"]);
//
//nconf.set("twitter:consumer_key", '');
//nconf.set("twitter:consumer_secret", '');
//nconf.set("twitter:access_token_key", '');
//nconf.set("twitter:access_token_secret", '');
//
//nconf.save(function (err) {
//    fs.readFile('config.json', function (err, data) {
//        console.dir(JSON.parse(data.toString()))
//    });
//});
/*

exports.conf = ftp;
exports.directories = directories;
exports.subtitles = subtitles;
exports.twitter = twitter;*/
exports.config = nconf.get();