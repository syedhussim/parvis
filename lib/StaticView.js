
const fs = require('fs');

class StaticView{

    constructor(file){
        this.file = file;
        this.path = '';
    }

    async execute(){
        return new Promise((res, rej) => {
            fs.readFile(this.path + this.file, (err, data) => {
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