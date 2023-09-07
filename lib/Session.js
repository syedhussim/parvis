const crypto = require("crypto");

class Session{

    constructor(request, response, options){
        this._request = request;
        this._response = response;
        this._sessionData = {};
        this.sessionName = options.name || 'NSID';

        if(this.request.cookies.hasOwnProperty(this.sessionName)){
            this.sessionId = this.request.cookies[this.sessionName];
        }else{
            this.sessionId = crypto.randomBytes(20).toString("hex");
        }
    }

    set(name, value){ 
        this._sessionData[name] = value;
    }

    setData(data){
        this._sessionData = data;
    }

    get(name){
        return this._sessionData[name];
    }

    getData(){
        return this._sessionData;
    }

    async close(){
        await this.write();
        this.response.addCookie(this.sessionName, this.sessionId, '/');
    }

    async destroy(){}

    clear(){
        this._sessionData  = {};
    }
}

module.exports = Session;