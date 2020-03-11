const fs = require('fs');
const HttpException = require('./HttpException.js');
const Controller = require('./Controller.js');
const MimeTypes = require('./MimeTypes.js');

class Application{

    constructor(documentRoot, appConfig, memoryStore, httpContext){
        this.documentRoot = documentRoot;
        this.appConfig = appConfig;
        this.memoryStore = memoryStore;
        this.httpContext = httpContext;
        this.registry = {};
    }

    async run(){
        this.use('memoryStore', this.memoryStore);
        this.use('request', this.httpContext.request);
        this.use('response', this.httpContext.response);

        let request = this.httpContext.request;
        let routing = this.appConfig.routing;

        try{

            let mimeType = 'text/html';

            let pos = request.url.pathname.lastIndexOf(".");

            if(pos > -1){
                let ext = request.url.pathname.substr(pos+1); 

                mimeType = MimeTypes.get(ext);
            }

            let data = await new Promise((res, rej) =>{
                fs.readFile(this.documentRoot + request.url.pathname, (err, data) => {
                    if(err){
                        rej(rej);
                    }else{
                        res(data);
                    }
                });
            }); 

            this.httpContext.response.addHeader('Content-Type', mimeType.mime);

            if(mimeType.type == 1){
                this.httpContext.response.write(data);
            }else{
                this.httpContext.response.write(data.toString('UTF8'));
            }

        }catch(err){
            for(let i=0; i < routing.length; i++){
                let route = routing[i];
                let regex = new RegExp(route.url);

                if(regex.test(request.url.pathname)){
                    await this.load();

                    let controllerClass = this.documentRoot + '/' + route.class.replace(/\./g, '/') + '.js';
                    let dynamicController = require(controllerClass);
                    let controller = new dynamicController();

                    if(controller instanceof Controller){
                        let actionResult = await controller.service(this.registry) || '';

                        if(typeof actionResult === 'object'){
                            if(typeof actionResult.execute == 'function'){
                                this.httpContext.response
                                .setContentType('text/html; charset=UTF8')
                                .write(await actionResult.execute());  
                            }else{
                                this.httpContext.response
                                .setContentType('application/json')
                                .write(JSON.stringify(actionResult));      
                            }
                               
                        }else{
                            this.httpContext.response.write(actionResult);
                        }
                    }else{
                        throw new HttpException(`The controller ${controllerClass} does not inherit from Parvis.Controller`, 501);
                    }

                    await this.unload();
                    
                    return;
                }
            }

            throw new HttpException('404 Page not found', 404);
        }
    }

    use(name, service){
        this.registry[name] =  service;
    }

    load(){}

    unload(){}

    error(e){ 
        this.httpContext.response.write(e.message);
    }
}

module.exports = Application;