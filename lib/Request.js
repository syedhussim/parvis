class Request{

    constructor(request){
        this.url = new URL('http://' + request.headers.host + request.url);
        this.method = request.method;
        this.query = this.url.searchParams;
    }
}

module.exports = Request