/**
 * Created by jaussan on 31/10/13.
 */
var moment = require("moment");
var log = require("./log");
var queue = [];
var QUEUE_DELAY = 1000;
var status = {
    isStarted: false
};
var config = require("./config").config;
var maxConcurrent = config.queue.maxConcurrent;
var currentlyRunning = 0;

function start(){

    status.isStarted = true;
    //log.info("Queue Started");
    setTimeout(function loop(){

        //log.info("Loop at "+new Date());
        if (!status.isStarted)
            return;

        if (queue.length > 0 && currentlyRunning < maxConcurrent){
            var job = queue[0];
            queue.splice(0, 1);

            if (job.start >= new Date()){
                queue.push(job);
            }
            else {
                log.info("Running a job "+job.name);
                currentlyRunning += 1;
                log.info(currentlyRunning+" jobs are running concurrently");
                job.run(function(){
                    currentlyRunning -= 1;
                    log.info("Job terminated, "+currentlyRunning+" jobs are running concurrently");
                });
            }
        }
        setTimeout(loop, QUEUE_DELAY);
    }, QUEUE_DELAY);
}

function stop(){
    status.isStarted = false;
}

function push(name, delayInSeconds, taskCallback){
    queue.push({
        name: name,
        start: moment().add('seconds', delayInSeconds),
        run: taskCallback
    })
}


exports.start = start;
exports.push = push;
exports.stop = stop;
exports.status = status;
exports.queue = queue;