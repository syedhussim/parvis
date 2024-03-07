const http = require('http');
const Request = require('./Request.js');
const Response = require('./Response.js');
const MemoryStore = require('./MemoryStore.js');
const { networkInterfaces } = require('os');

class WebHostBuilder{

    constructor(){
        this.servers = [];
        this.ipList = [];

        let nets = networkInterfaces();

        for (const name of Object.keys(nets)){
            for (const net of nets[name]) {
                const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4

                if (net.family === familyV4Value && !net.internal) {
                    this.ipList.push(net.address);
                }
            }
        }
    }

    addServer(server){
        this.servers.push(server);
        return this;
    }

    run(){

        let memoryStore = new MemoryStore();

        for(let i=0; i < this.servers.length; i++){

            let server = this.servers[i]; 

            if(server.address == "_"){
                server.address = this.ipList[0];
            }

            let appConfig = require(server.documentRoot + '/config.js');

            let serverSettings = {
                addpress : server.address,
                port : server.port,
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

                let App = require(server.documentRoot + '/App.js');
                let app = new App();

                try{
                    await app.run(documentRoot, serverSettings, appConfig, memoryStore, request, response);
                }
                catch(err){
                    await app.error(err);
                }
                app = null;
                response.end();

            }).listen(server.port, server.address, () => {
                console.log('Server started on ' + server.address + ':' + server.port);
            });
        }
    }
}

module.exports = WebHostBuilder;