const http = require('http');
const Request = require('./Request.js');
const Response = require('./Response.js');
const HttpContext = require('./HttpContext.js');
const MemoryStore = require('./MemoryStore.js');

class WebHostBuilder{

    constructor(){
        this.servers = [];
    }

    addServer(server){
        this.servers.push(server);
        return this;
    }

    run(){

        let memoryStore = new MemoryStore();

        for(let i=0; i < this.servers.length; i++){
            let server = this.servers[i];   

            http.createServer(async(req, res) => {

                let request = new Request(req);
                let response = new Response(res);
                let httpContext = new HttpContext(request, response);
                let documentRoot = server.vhosts[request.url.hostname];

                try{
                    let appConfig = require(documentRoot + '/config.js');
                    let App = require(documentRoot + '/App.js');
                    let app = new App(documentRoot, appConfig, memoryStore, httpContext);

                    try{
                        await app.run();
                    }
                    catch(err){
                        await app.error(err);
                    }
                }catch(err){
                    console.log(err)
                }
                
                response.end();

            }).listen(server.port, server.address, ()=> {
                console.log('Server started on ' + server.address + ':' + server.port);
            });
        }
    }
}

module.exports = WebHostBuilder;