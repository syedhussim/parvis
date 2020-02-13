String.prototype.equals = function(str){
    if(this.toString() === str){
        return true;
    }
    return false;
}

Date.prototype.format = function(format){
    let formattedDate = [];

    for(let i=0; i < format.length; i++){
        let char = format[i];

        switch(char){
            case 'D':
                let shortDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                formattedDate.push(shortDays[this.getDay()-1]);
                break;
            case 'd':
                formattedDate.push(this.getDate());
                break;
            case 'F':
                let months = ['January', 'February', 'March ', 'April ', 'May ', 'June ', 'July', 'August', 'September', 'October', 'November', 'December'];
                formattedDate.push(months[this.getMonth()]);
                break; 
            case 'Y':
                formattedDate.push(this.getFullYear());
                break; 
            case 'm':
                formattedDate.push(this.getMonth()+1);
                break; 
            case 'H':
                formattedDate.push(this.getHours());
                break; 
            case 'i':
                formattedDate.push(this.getMinutes());
                break; 
            case 's':
                formattedDate.push(this.getSeconds());
                break; 
            default: 
                formattedDate.push(char);   
                break; 
        }
    }
    return formattedDate.join('');
}

exports.WebHostBuilder = require('./lib/WebHostBuilder.js');
exports.Server = require('./lib/Server.js');
exports.Application = require('./lib/Application.js');
exports.Controller = require('./lib/Controller.js');
exports.HttpController = require('./lib/HttpController.js');
exports.View = require('./lib/View.js');
exports.Session = {
    Memory : require('./lib//Session/Memory.js'),
    FileSystem : require('./lib//Session/FileSystem.js')
};