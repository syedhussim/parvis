const crypto = require("crypto");

class Session{

    constructor(httpContext, options){
        this._httpContext = httpContext;
        this._sessionData = {};
        this.sessionName = options.name || 'NSID';

        if(this._httpContext.request.cookies.hasOwnProperty(this.sessionName)){
            this.sessionId = this._httpContext.request.cookies[this.sessionName];
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
        this._httpContext.response.addCookie(this.sessionName, this.sessionId, '/');
    }

    async destroy(){}

    clear(){
        this._sessionData  = {};
    }
}

module.exports = Session;