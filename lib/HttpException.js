class HttpException extends Error{

    constructor(message, httpCode){
        super(message); 
        this.name = this.constructor.name;
        this.httpCode = httpCode;
    }
}

module.exports = HttpException;