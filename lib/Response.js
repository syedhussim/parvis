class Response{

    constructor(response){
        this.out = response;
        this._httpCode = 200;
        this._headers = {};
        this._cookies = [];
        this._output = '';
        this._flushed = false;
    }

    setContentType(type){
        if(!this.hasHeader('Content-Type')){
            this.addHeader("Content-Type", type);
        }
        return this;
    }

    setHttpCode(code){
        this._httpCode = code;
        return this;
    }

    addHeader(header, value){
        this._headers[header] = value;
        return this;
    }

    hasHeader(header){
        if(this._headers.hasOwnProperty(header)){
            return true;
        }
        return false;
    }

    write(string){
        this._output = string;
        return this;
    }

    addCookie(name, value, path){
        this._cookies.push({name, value, path});
        return this;
    }

    redirect(location){

        let cookieHeader = '';

        for(let i=0; i < this._cookies.length; i++){
            let { name, value, path } = this._cookies[i];
            cookieHeader += name + '=' + value + '; path=' + path + '; HttpOnly';
        }

        this.out.writeHead(302, {'Location': location, 'Set-Cookie' : cookieHeader});
        this.out.end();
        this._flushed = true;
    }

    end(){
        if(this._flushed){
            return;
        }

        let cookieHeader = '';

        for(let i=0; i < this._cookies.length; i++){
            let { name, value, path } = this._cookies[i];
            
            cookieHeader += name + '=' + value + '; path=' + path + '; HttpOnly';
        }

        if(this._cookies.length > 0){
            this.addHeader("Set-Cookie", cookieHeader);
        }
        
        this.out.writeHead(this._httpCode, this._headers);
        this.out.end(this._output);

        this._flushed = true;
    }
}

module.exports = Response;
