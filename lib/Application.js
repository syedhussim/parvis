const fs = require('fs');
const Controller = require('./Controller.js');

class Application{

    constructor(documentRoot, appConfig, httpContext){
        this.documentRoot = documentRoot;
        this.appConfig = appConfig;
        this.httpContext = httpContext;
        this.registry = {};
    }

    async run(){
        this.use('request', this.httpContext.request);
        this.use('response', this.httpContext.response);

        let request = this.httpContext.request;
        let routing = this.appConfig.routing;

        try{
            let data = fs.readFileSync(this.documentRoot + request.url.pathname);
            this.httpContext.response.write(data.toString('UTF8'));
        }catch(err){
            for(let i=0; i < routing.length; i++){
                let route = routing[i];
                let regex = new RegExp(route.url);

                if(regex.test(request.url.pathname)){
                    this.load();

                    let controllerClass = this.documentRoot + '/' + route.class.replace(/\./g, '/') + '.js';
                    let Controller = require(controllerClass); 
                    let controller = new Controller();

                    //if(controller instanceof Controller){
                        let actionResult = await controller.service(this.registry) || '';

                        if(typeof actionResult === 'object'){
                            if(typeof actionResult.execute == 'function'){
                                this.httpContext.response
                                .setContentType('text/html')
                                .write(await actionResult.execute());  
                            }else{
                                this.httpContext.response
                                .setContentType('application/json')
                                .write(JSON.stringify(actionResult));      
                            }
                               
                        }else{
                            this.httpContext.response.write(actionResult);
                        }
                    //}
                    
                    return;
                }
            }

            throw new Error('404 page not found');
        }
    }

    use(name, service){
        this.registry[name] =  service;
    }

    load(){

    }

    error(e){ 
        this.httpContext.response.write(e.message);
    }
}

module.exports = Application;