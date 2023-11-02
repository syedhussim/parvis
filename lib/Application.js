const fs = require('fs');
const HttpException = require('./HttpException.js');
const Controller = require('./Controller.js');
const MimeTypes = require('./MimeTypes.js');

class Application{

    async run(documentRoot, serverSettings, appConfig, memoryStore,  request, response){ 

        this.documentRoot = documentRoot;
        this.serverSettings = serverSettings;
        this.appConfig = appConfig;
        this.memoryStore = memoryStore;
        this.request = request;
        this.response = response;
        this.registry = {};

        this.use('documentRoot', this.documentRoot);
        this.use('request', request);
        this.use('serverSettings', this.serverSettings);
        this.use('request', request);
        this.use('response', response);

        let routing = this.appConfig.routing;

        let mimeType = 'text/html';

        let pos = request.url.pathname.lastIndexOf(".");

        if(pos > -1){

            mimeType = MimeTypes.get(request.url.pathname.substr(pos+1));

            for(let path of this.serverSettings.file_locations){
                try{
                    let buffer = await this._tryFile(path, request);

                    response.addHeader('Content-Type', mimeType.mime);
                    response.write(buffer);
                    return;
                }catch(e){ }
            }
        }else{

            for(let i=0; i < routing.length; i++){

                let route = routing[i];
                let regex = new RegExp(route.url);

                if(regex.test(request.url.pathname)){

                    await this.load();

                    let controllerClass = this.documentRoot + '/' + route.class.replace(/\./g, '/') + '.js';
                    let dynamicController = require(controllerClass);
                    let controller = new dynamicController(this.registry);

                    if(controller instanceof Controller){

                        let actionResult = await controller.service(this.registry) || '';

                        if(typeof actionResult === 'object'){
                            if(typeof actionResult.execute == 'function'){
                                response
                                    .setContentType('text/html; charset=UTF8')
                                    .write(await actionResult.execute());  
                            }else{
                                response
                                    .setContentType('application/json')
                                    .write(JSON.stringify(actionResult));      
                            }
                            
                        }else{
                            response.write(actionResult);
                        }
                    }else{
                        throw new HttpException(`The controller ${controllerClass} does not inherit from Parvis.Controller`, 501);
                    }

                    await this.unload();
                    
                    return;
                }
            }
        }

        response.setHttpCode(404);

        throw new HttpException('404 Page not found. ' + request.url.pathname, 404);
    }

    use(name, service){
        this.registry[name] =  service;
    }

    async load(){}

    async unload(){}

    error(e){ 
        response.write(e.message);
    }

    async _tryFile(path, request){
        return new Promise((res, rej) =>{
            fs.readFile(path + request.url.pathname, (err, data) => {
                if(err){
                    rej(err);
                }else{
                    res(data);
                }
            });
        }); 
    }
}

module.exports = Application;
