class Response{

    constructor(response){
        this._response = response;
    }

    setContentType(type){
        this._response.setHeader("Content-Type", type);
        return this;
    }

    write(string){
        this._response.write(string);
        return this;
    }
}

module.exports = Response;