/**
 * Created by Antoine on 02/11/2013.
 */

var util = require('util');
var twitter = require('twitter');
var config = require("./config");

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
