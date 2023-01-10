String.prototype.equals = function(str){
    let thisValue = this.toString();

    if(thisValue == null){
        thisValue = '';
    }
    if(thisValue === str){
        return true;
    }
    return false;
}

String.prototype.ifEmpty = function(str){
    if(this.toString() == ""){
        return str;
    }
    return this.toString();
}

String.prototype.ifEmptyThen = function(str1, str2){
    if(this.toString() == ""){
        return str1;
    }
    return str2;
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
exports.View2 = require('./lib/View2.js');
exports.HttpException = require('./lib/HttpException.js');
exports.MimeTypes = require('./lib/MimeTypes.js');
exports.Utils = require('./lib/Utils.js');
exports.Validation = require('./lib/Validation.js');
exports.Session = {
    Memory : require('./lib//Session/Memory.js'),
    FileSystem : require('./lib//Session/FileSystem.js')
};
