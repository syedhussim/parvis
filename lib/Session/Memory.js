const Session = require('../Session.js');

class Memory extends Session{

    constructor(request, response, memoryStore, options = {}){
        super(request, response, options);
        this._memoryStore = memoryStore; 
    }

    read(){

        if(this._memoryStore.exist(this.sessionId)){
            this.setData(this._memoryStore.get(this.sessionId));
        }else{
            this._memoryStore.add(this.sessionId, {});
        }
    }

    write(){
        this._memoryStore.add(this.sessionId, this.getData());
    }
}

module.exports = Memory;