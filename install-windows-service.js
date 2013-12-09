/**
 * Created by Antoine on 02/11/2013.
 */
// Before using (on Windows only), run
// npm install node-windows -g

var Service = require('node-windows').Service;

// Create a new service object
var svc = new Service({
    name:'Monitrjsd',
    description: 'Monitr JS',
    script: 'C:\\bin\\monitrjs\\index.js'
});

// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
    svc.start();
});

svc.install();