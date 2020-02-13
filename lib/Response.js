class Response{

    constructor(response){
        this.out = response;
        this._cookies = [];
        this._output = '';
        this._flushed = false;
    }

    setContentType(type){
        this.out.setHeader("Content-Type", type);
        return this;
    }

    addHeader(header, value){
        this.out.setHeader(header, value);
        return this;
    }

    write(string){
        this._output = string;
        return this;
    }

    addCookie(name, value, path){
        this._cookies.push({name, value, path});
    }

    redirect(location){
        this.out.writeHead(302, {'Location': location});
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
            this.out.setHeader("Set-Cookie", cookieHeader);
        }

        this.out.write(this._output);
        
        this.out.end();
    }
}

module.exports = Response;