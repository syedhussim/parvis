const fs = require('fs');

class Token{

    constructor(tokenType, tokenValue){
        this.tokenType = tokenType;
        this.tokenValue = tokenValue;
    }
}

class View{

    constructor(file, params){
        this.file = file;
        this.params = params;
        this.path = '';
    }

    async execute(){
        var data = await this._readFile();
        var len = data.length;
        var token = '';
        var tokens = [];
        var captureCodeBlock = false;
        var codeType = '';

        for(var idx = 0; idx < len; idx++){
            
            var cc = data[idx];
            var nc = data[idx + 1];
            
            if(['$', '@'].includes(cc) && nc === '{'){
                tokens.push(new Token('T_STRING', token));
                token = '';
                captureCodeBlock = true;
                codeType = cc;
                idx++;
                continue;
            }

            if(cc === '}' && captureCodeBlock){
                var tokenType = (codeType === '$') ? 'T_ESCAPE_CODE' : 'T_BLOCK_CODE';
                tokens.push(new Token(tokenType, token));
                token = '';
                captureCodeBlock = false;
                continue;
            }

            token += cc;
        }
        tokens.push(new Token('T_STRING', token));

        var output = [];

        output.push('var out = ""; ');

        for(let idx in tokens){

            let token = tokens[idx];

            switch(token.tokenType){
                case 'T_ESCAPE_CODE':
                        output.push("out += " + token.tokenValue + ";");
                    break;
                case 'T_BLOCK_CODE':
                        let tokenValue = token.tokenValue.trim();
                        let parsedToken = await this._parseToken(tokenValue);
                        output.push(parsedToken);
                        break;
                    default:
                        output.push("out +='" + token.tokenValue + "';");

            }
        }

        output.push('return out;');

        let keys = [];
        let vals = []; 

        for(let key in this.params){
            keys.push(key);
            vals.push(this.params[key]);
        }

        var func = new Function(...keys, output.join(""));
        return func(...vals);
    }

    async _parseToken(blockToken){
        var tokens = blockToken.split(' ');

        switch(tokens[0]){
            case 'if': 
                return 'if (' + tokens.splice(1).join(' ') + '){';
            case 'else': 
                return '}else{';
            case '/if': 
                return '}';
            case 'for': 
                return 'for (' + tokens.splice(1).join(' ') + '){';
            case '/for': 
                return '};';
            case 'foreach': 
                return 'for (let idx in ' + tokens[tokens.length-1] + '){ let ' + tokens[1] + ' = ' + tokens[tokens.length-1] + '[idx];';
            case '/foreach': 
                return '};';
            case 'include': 
                let file = tokens[1];

                if(file.substring(0,1) == '\''){
                    file = file.substring(1);
                }

                if(file.substr(-1) == '\''){ 
                    file = file.substring(0, file.length-1);
                }

                let view = new View(file, this.params);
                view.path = this.path;
                let output = await view.execute();
                return 'out += \'' + output + '\';';
            default:
                return blockToken;
        }
    }

    async _readFile(){
        return new Promise((res, rej) => {
            fs.readFile(this.path + this.file, (err, data) => {
                if(err){
                    rej(err);
                }else{
                    res(data.toString('UTF8').replace(/(?:\r\n|\r|\n)/g, ""));
                }
            });
        });
    }
}

module.exports = View;