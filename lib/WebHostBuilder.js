const http = require('http');
const Request = require('./Request.js');
const Response = require('./Response.js');
const MemoryStore = require('./MemoryStore.js');
const { networkInterfaces } = require('os');

class WebHostBuilder{

    constructor(){
        this.servers = [];
        const nets = networkInterfaces();

const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
} console.log(results);
    }

    addServer(server){
        this.servers.push(server);
        return this;
    }

    run(){

        let memoryStore = new MemoryStore();

        for(let i=0; i < this.servers.length; i++){

            let server = this.servers[i];   

            let App = require(server.documentRoot + '/App.js');
            let app = new App();

            let appConfig = require(server.documentRoot + '/config.js');

            let serverSettings = {
                file_locations : [ server.documentRoot ]
            };

            if(appConfig.server){ 
                if(appConfig.server.file_locations){
                    serverSettings.file_locations = serverSettings.file_locations.concat(appConfig.server.file_locations);
                }
            }

            http.createServer(async(req, res) => {

                let request = new Request(req);
                let response = new Response(res);

                let documentRoot = server.documentRoot;

                try{
                    await app.run(documentRoot, serverSettings, appConfig, memoryStore, request, response);
                }
                catch(err){
                    await app.error(err);
                }

                response.end();

            }).listen(server.port, server.address, ()=> {
                console.log('Server started on ' + server.address + ':' + server.port);
            });
        }
    }
}

module.exports = WebHostBuilder;