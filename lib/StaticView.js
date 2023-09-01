
const fs = require('fs');

class StaticView{

    constructor(){
        this._file = '';
        this._path = '';
        this._includes = [];
    }

    file(file){
        this._file = file;
    }

    path(path){
        this._path = path;
    }

    addFile(name, file){
        this._includes.push({
            name : name,
            file : file
        });
    }

    addFiles(files = {}){
        for(let [name, file] of Object.entries(files)){
            this.addFile(name, file);
        }
    }

    async execute(){

        let template = await this._readFile(this._path + this._file);

        for(let include of this._includes){

            if(include.file.substring(0, 1) == '~'){
                include.file = this._path + include.file.substring(1);
            }

            template = template.replaceAll('<include:' + include.name + '/>', await this._readFile(include.file));
        }
        
        return template;
    }

    async _readFile(file){
        return new Promise((res, rej) => {
            fs.readFile(file, (err, data) => {
                if(err){
                    rej(err);
                }else{
                    res(data.toString('UTF8'));
                }
            });
        });
    }
}

module.exports = StaticView;