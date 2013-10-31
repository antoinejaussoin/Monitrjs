/**
 * Created by Antoine on 31/10/2013.
 */
var growl = require("growl");

var send = function(title, message){
    growl(message, { title: title, name: 'MonitrJS' });
}

module.exports = send;