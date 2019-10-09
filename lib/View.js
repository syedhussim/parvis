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

        tokens.forEach((token) => {

            switch(token.tokenType){
                case 'T_ESCAPE_CODE':
                        output.push('out += ' + token.tokenValue + ';');
                    break;
                case 'T_BLOCK_CODE':
                        var tokenValue = token.tokenValue.trim();
                        output.push(this._parseToken(tokenValue));
                        break;
                    default:
                        output.push("out +='" + token.tokenValue + "';");

            }
        });

        output.push('return out;');

        let keys = [];
        let vals = []; 

        for(let key in this.params){
            keys.push(key);
            vals.push(this.params[key]);
        }

try{
        var func = new Function(...keys, output.join(''));
        return func(...vals);
}catch(e){
    console.log(output.join(''));
    return '';
}

    }

    _parseToken(blockToken){
        var tokens = blockToken.split(' ');

        switch(tokens[0]){
            case 'if': 
                return tokens[0] + '(' + tokens.splice(1).join(' ') + '){';
            case 'else': 
                return '}else{';
            case '/if': 
                return '}';
            case 'for': 
                return tokens[0] + '(' + tokens.splice(1).join(' ') + '){';
            case '/for': 
                return '};';
            case 'foreach': 
                return tokens[tokens.length-1] + '.forEach((' + tokens[1] + ', key) => {';
            case '/foreach': 
                return '});';
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