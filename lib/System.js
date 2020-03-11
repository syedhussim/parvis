const { spawn } = require('child_process');

class System{

    static async memory(){

        const fr = spawn('free', ['-m']);

        return new Promise((res, rej) => {

            let x = '';

            fr.stdout.on('data', (data) =>{
                x += data.toString();
            });

            fr.stdout.on('close', (data) => {
                let lines = x.split("\n");
                let headers = [];
                let values = [];

                for(let i in lines){
                    let columns = lines[i].split(" ");

                    if(i == 0){
                        for(let j in columns){
                            if(columns[j].trim() !=''){
                                headers.push(columns[j].replace("/", "_"));
                            }
                        }
                    }

                    if(i == 1){
                        for(let j in columns){
                            if(columns[j].trim() !=''){
                                values.push(columns[j]);
                            }
                        }
                    }
                }

                if(values[0] == 'Mem:'){
                    values.splice(0,1);
                }

                let result = {};

                for(let k in headers){
                    result[headers[k]] = values[k];
                }
                res(result);
            });

            fr.on('error', (err) => {
                rej(err);
            });
        });
    }
}

module.exports = System;