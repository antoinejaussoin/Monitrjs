var twitter = require('twitter');
var config = require("./config").config;

function send(message){
    var twit = new twitter(config.twitter);

    twit
        .verifyCredentials(function(data) {
            console.log("Twitter connected to "+data.name);
        })
        .updateStatus(message,
        function(data) {
            console.log("Twitter message '"+message+"' sent.");
        }
    );
}

exports.send = send;
