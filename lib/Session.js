const crypto = require("crypto");

class Session{

    constructor(request, response, options){
        this._request = request;
        this._response = response;
        this._sessionData = {};
        this._sessionName = options.name || 'NSID';

        if(this._request.cookies.hasOwnProperty(this._sessionName)){
            this._sessionId = this._request.cookies[this._sessionName];
        }else{
            this._sessionId = crypto.randomBytes(20).toString("hex");
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
        this._response.addCookie(this._sessionName, this._sessionId, '/');
    }

    async destroy(){}

    clear(){
        this._sessionData  = {};
    }
}

module.exports = Session;