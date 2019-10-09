class Response{

    constructor(response){
        this.output = [];
        this.response = response;
    }

    write(string){
        this.response.write(string);
        return this;
    }
}

module.exports = Response;