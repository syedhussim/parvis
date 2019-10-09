const fs = require('fs');
const Controller = require('./Controller.js');

class Application{

    constructor(appConfig){
        this.appConfig = appConfig;
        this.registry = {};
    }

    init(appPath, httpContext){
        this.appPath = appPath;
        this.httpContext = httpContext;
    }

    async run(){
        this.use('request', this.httpContext.request);
        this.use('response', this.httpContext.response);

        let request = this.httpContext.request;
        let routing = this.appConfig.routing;

        try{
            let data = fs.readFileSync(this.appPath + request.url.pathname);
            this.httpContext.response.write(data.toString('UTF8'));
            return;
        }catch(err){

        }

        for(let i=0; i < routing.length; i++){
            let route = routing[i];
            let regex = new RegExp(route.url);

            if(regex.test(request.url.pathname)){
                this.load();

                let controllerClass = this.appPath + '/' + route.class.replace(/\./g, '/') + '.js';
                let Controller = require(controllerClass); 
                let controller = new Controller();

                //if(controller instanceof Controller){
                    let actionResult = await controller.service(this.registry);

                    if(typeof actionResult === 'string'){
                        this.httpContext.response.write(actionResult);         
                    }else{
                        let output = await actionResult.execute();
                        this.httpContext.response.write(output);
                    }
                //}
                
                break;
            }
        }
    }

    use(name, service){
        this.registry[name] =  service;
    }

    load(){

    }

    error(e){
        console.log(e);
    }
}

module.exports = Application;