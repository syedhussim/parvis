const http = require('http');
const {URL} = require('url');
const Application = require('./Application.js');
const Request = require('./Request.js');
const Response = require('./Response.js');
const HttpContext = require('./HttpContext.js');

class Server{

    run(config){ 

        let vhosts = config.vhosts;

        for(let i=0; i < vhosts.length; i++){
            let vhost = vhosts[i];
            let array = vhost.address.split(':');
            let host = array[0] == '*' ? '127.0.0.1' : array[0];

            let appConfig = require(vhost.path + '/config.js');
            let App = require(vhost.path + '/App.js');
            let app = new App(appConfig);

            http.createServer(async(req, res) => {

                let request = new Request(req);
                let response = new Response(res);
                let httpContext = new HttpContext(request, response);

                if(request.url.hostname.equals(vhost.server)){
                    try{
                        app.init(vhost.path, httpContext);
                        await app.run();
                    }
                    catch(e){
                        app.error(e);
                    }
                }
                res.end();

            }).listen(array[1], ()=> {
                console.log('Server started on ' + host + ':' + array[1]);
            });
        }
    }
}

module.exports = Server;