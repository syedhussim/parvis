const Session = require('../Session.js');
const fs = require('fs');

class FileSystem extends Session{

    constructor(request, response, options = {}){
        super(request, response, options);
        this._options = options;
    }

    async read(){
        let sessionFile = this._options.path + '/' + this._sessionId;

        try{
            let data = await new Promise((res, rej) => {
                fs.readFile(sessionFile, (err, data) => {
                    if(err){
                        rej(err);
                    }else{
                        res(data.toString('UTF8'));
                    }
                });
            });

            this.setData(JSON.parse(data));
        }catch(err){
            await this._writeToFile(sessionFile, {});
            this.setData({});
        }
    }

    async write(){ 
        let sessionFile = this._options.path + '/' + this._sessionId;

        try{
            await this._writeToFile(sessionFile, this.getData());
        }catch(err){
        }
    }

    async destroy(){
        let sessionFile = this._options.path + '/' + this._sessionId;

        try{
            await new Promise((res, rej) => {
                fs.unlink(sessionFile, err => {
                    if(err){
                        rej(err);
                    }else{
                        res(true);
                    }
                });
            });

            return true;
        }catch(err){ console.log(err);
            return false;
        }
    }

    async _writeToFile(sessionFile, data){
        return new Promise((res, rej) => {
            fs.writeFile(sessionFile, JSON.stringify(data), err => {
                if(err){
                    rej(err);
                }else{
                    res(true);
                }
            });
        });
    }
}

module.exports = FileSystem;