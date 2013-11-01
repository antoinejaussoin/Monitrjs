/**
 * Created by jaussan on 01/11/13.
 */
var queue = require("./../queue");
var sinon = require("sinon");

var clock = sinon.useFakeTimers();

describe("Queue", function(){
   describe("When starting and stoping the queue", function(){
       beforeEach(function(done){
           //var callback = sinon.spy();
            done();

       });

       afterEach(function(){
           queue.stop();
       });

       it('It should start and stop correctly', function(){
           queue.status.isStarted.should.be.false;
           queue.start();
           queue.status.isStarted.should.be.true;
           queue.stop();
           queue.status.isStarted.should.be.false;
       });
   });

    describe("When adding an item in the queue", function(){
        beforeEach(function(done){
            queue.start();
            done();
        });

        afterEach(function(){
            queue.stop();
        });

        it("It should execute the item when needed", function(done){
            queue.push("Task 1", 100, done);
            queue.queue.length.should.equal(1);
            clock.tick(1000); // Forward 1 second: the task is still not ready to be executed
            queue.queue.length.should.equal(1);
            clock.tick(100000); // Forward 100 seconds: the task is ready now
            queue.queue.length.should.equal(0);
        });
    });

    describe("When adding an item in the queue (second method)", function(){
        beforeEach(function(done){
            queue.start();
            done();
        });

        afterEach(function(){
            queue.stop();
        });

        it("It should execute the item when needed", function(){
            var callback = sinon.spy();
            queue.push("Task 1", 100, callback);
            queue.queue.length.should.equal(1);
            clock.tick(1000); // Forward 1 second: the task is still not ready to be executed
            callback.called.should.be.false;
            queue.queue.length.should.be.exactly(1);
            clock.tick(100000); // Forward 100 seconds: the task is ready now
            queue.queue.length.should.equal(0);
            callback.called.should.be.true;
        });
    });
});

describe("Timeout test", function(){
   it("It should fake the passing of time", function(){
       var success = false;

       setTimeout(function(){
           success = true;
       }, 10000); // That should be 10 seconds in normal time

       success.should.be.false; // not there yet
       clock.tick(1000);
       success.should.be.false; // not there yet either
       clock.tick(8999);
       success.should.be.false; // still not there
       clock.tick(1);
       success.should.be.true; // yeah!
   });
});