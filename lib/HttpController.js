const Controller = require('./Controller.js');

class HttpController extends Controller{

    get(registry){}
    post(registry){}
    put(registry){}
    patch(registry){}
    delete(registry){}

    async service(registry){
        return await this._executeMethod(registry);
    }

    async authorize(){
        return true;
    }

    async _executeMethod(registry){

        let auth = await this.authorize(registry);

        if(auth){
                switch(registry.request.method){
                    case 'GET':
                        return this.get(registry);
                    case 'POST':
                        return this.post(registry);
                    case 'PUT':
                        return this.put(registry);
                    case 'PATCH':
                        return this.patch(registry);
                    case 'DELETE':
                        return this.delete(registry);
                }
        }
    }
}

module.exports = HttpController;
