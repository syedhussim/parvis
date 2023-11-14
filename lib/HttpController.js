const Controller = require('./Controller.js');

class HttpController extends Controller{

    async get(registry){}
    async post(registry){}
    async put(registry){}
    async patch(registry){}
    async delete(registry){}

    constructor(registry){
        super();
        Object.assign(this, registry);
    }

    async service(registry){
        return await this._executeMethod(registry);
    }

    async authorize(){
        return true;
    }

    async load(){}

    async unload(){}

    async _executeMethod(registry){

        let auth = await this.authorize(registry);

        if(auth){

            await this.load();
            
            switch(registry.request.method){
                case 'GET':
                    return await this.get(registry);
                case 'POST':
                    return await this.post(registry);
                case 'PUT':
                    return await this.put(registry);
                case 'PATCH':
                    return await this.patch(registry);
                case 'DELETE':
                    return await this.delete(registry);
            }
        }
    }
}

module.exports = HttpController;