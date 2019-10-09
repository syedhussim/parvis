class Parser{

    static compile(file){
        var data = fs.readFileSync(file).toString('UTF8').replace(/(?:\r\n|\r|\n)/g, "");
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
                        output.push(parseToken(tokenValue));
                        break;
                    default:
                        output.push('out +="' + token.tokenValue + '";');

            }
        });

        output.push('return out;');

        var func = new Function(...keys, output.join(''));
        return func(...vals);
    }
}