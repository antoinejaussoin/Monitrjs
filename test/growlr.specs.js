var sinon = require("sinon");
var rewire = require("rewire");

describe("Growlr", function(){
    var mockGrowl;
    var growlr;

    beforeEach(function(){
        growlr = rewire("./../growlr.js");
        mockGrowl = function(message, options){};
        growlr.__set__("growl", mockGrowl);

    });

    it("It should call the Growl API with the right parameters", function(){
       // Act
        //growlr.send("Title", "Message");

        // Assert
        //mockGrowl.calledWith("Message", {title:"Title", name: "MonitrJS"}).should.be.true;
    });

});
