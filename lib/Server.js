class Server{

    constructor(address, port){
        this.address = address;
        this.port = port;
        this.vhosts = {}
    }

    addHost(serverName, documentRoot){
        this.vhosts[serverName] = documentRoot;
        return this;
    }
}

module.exports = Server;