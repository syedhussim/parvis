String.prototype.equals = function(str){
    if(this.toString() === str){
        return true;
    }
    return false;
}

exports.WebHostBuilder = require('./lib/WebHostBuilder.js');
exports.Server = require('./lib/Server.js');
exports.Application = require('./lib/Application.js');
exports.Controller = require('./lib/Controller.js');
exports.HttpController = require('./lib/HttpController.js');
exports.View = require('./lib/View.js');