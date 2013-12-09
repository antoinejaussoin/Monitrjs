var nconf = require("nconf");

nconf.env().argv();

nconf.file(__dirname+'/config.json');

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
    "queue":{
        "maxConcurrent": 10
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

exports.config = nconf.get();