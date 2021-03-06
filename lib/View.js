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

    async compile(){
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

        for(let idx in tokens){

            let token = tokens[idx];

            switch(token.tokenType){
                case 'T_ESCAPE_CODE':
                        output.push("out += " + token.tokenValue + ";");
                    break;
                case 'T_BLOCK_CODE':
                        let tokenValue = token.tokenValue.trim();
                        let parsedToken = await this._parseToken(tokenValue);
                        if(typeof parsedToken == 'object'){ 
                            output = output.concat(parsedToken);
                        }else{
                            output.push(parsedToken);
                        }
                        break;
                    default:
                        output.push("out +='" + token.tokenValue + "';");

            }
        }

        return output;
    }

    async execute(){

        let keys = [];
        let vals = []; 

        for(let key in this.params){
            keys.push(key);
            vals.push(this.params[key]);
        }

        let compiled = await this.compile();
        var func = new Function(...keys, 'var out = ""; ' + compiled.join("") + 'return out;');

        return func(...vals);
    }

    async _parseToken(blockToken){
        var tokens = blockToken.split(' ');

        switch(tokens[0]){
            case 'if':  
                return 'if (' + tokens.splice(1).join(' ') + '){';
            case 'elseif':  
                return '}else if (' + tokens.splice(1).join(' ') + '){';
            case 'else': 
                return '}else{';
            case '/if': 
                return '}';
            case 'for': 
                return 'for (' + tokens.splice(1).join(' ') + '){';
            case '/for': 
                return '};';
            case 'foreach': 
                return 'for (let key in ' + tokens[tokens.length-1] + '){ let ' + tokens[1] + ' = ' + tokens[tokens.length-1] + '[key];';
            case '/foreach': 
                return '}';
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
                let compiled = await view.compile();
                return compiled;
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