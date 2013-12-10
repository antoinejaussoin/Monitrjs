var growl = require("growl");

var send = function(title, message){
    growl(message, { title: title, name: 'MonitrJS' });
}

module.exports = send;