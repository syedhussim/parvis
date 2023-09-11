const Session = require('../Session.js');

class Memory extends Session{

    constructor(request, response, memoryStore, options = {}){
        super(request, response, options);
        this._memoryStore = memoryStore; 
    }

    read(){

        if(this._memoryStore.exist(this._sessionId)){
            this.setData(this._memoryStore.get(this._sessionId));
        }else{
            this._memoryStore.add(this._sessionId, {});
        }
    }

    write(){
        this._memoryStore.add(this._sessionId, this.getData());
    }
}

module.exports = Memory;