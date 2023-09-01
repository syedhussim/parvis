class Server{

    constructor(address, port, documentRoot){
        this.address = address;
        this.port = port;
        this.documentRoot = documentRoot;
    }
}

module.exports = Server;