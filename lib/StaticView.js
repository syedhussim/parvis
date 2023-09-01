
const fs = require('fs');

class StaticView{

    constructor(file){
        this.file = file;
        this.path = '';
    }

    async execute(){
        let template = await this.loadTemplate(this.path + this.file);

        return template;
    }

    async loadTemplate(file){
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