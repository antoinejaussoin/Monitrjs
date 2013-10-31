/**
 * Created by jaussan on 31/10/13.
 */
var moment = require("moment");
var log = require("./log");
var queue = [];
var QUEUE_DELAY = 1000;

function start(){

    setTimeout(function loop(){
        if (queue.length > 0){
            var job = queue[0];
            queue.splice(0, 1);

            if (job.start > new Date()){
                queue.push(job);
            }
            else {
                log.info("Running a job "+job.name);
                job.run();
            }
        }
        setTimeout(loop, QUEUE_DELAY);
    }, QUEUE_DELAY);
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