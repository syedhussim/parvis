const { parse } = require('querystring');

class Request{

    constructor(request){
        this.url = new URL('http://' + request.headers.host + request.url);
        this.method = request.method;
        this.query = this.url.searchParams;
        this.post = {};
        this.cookies = {};
        this.headers = request.headers;
        this.clientIp = request.connection.remoteAddress

        if(this.headers.hasOwnProperty('cookie')){
            this.cookies = this._parseCookie(this.headers.cookie);
        }

        try{
            this.post = this._parsePostBody(request);
        }catch(err){}
    }

    hasHeader(header, withValue = null){
        if(this.headers.hasOwnProperty(header)){
            if(withValue !== null){
                if(this.headers.hasOwnProperty(header) == withValue){
                    return true;
                }else{
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    _parseCookie(cookie){
        let cookies = {};

        if(cookie.length > 0){
            let cookieSections = cookie.split(';');

            for(let idx in cookieSections){
                let cookie = cookieSections[idx].split('=');
                cookies[cookie[0].trim()] = cookie[1];
            }
        }
        return cookies;
    }

    _parsePostBody(request){
        return new Promise((resolve, reject) => {

            let body = '';

            request.on('data', data => {
                body += data.toString();
            });

            request.on('end', () => {

               let data = '';

               if (this.hasHeader('content-type') && this.headers['content-type'].indexOf('application/json') > -1){
                   data = JSON.parse(body);
               }else{
                   data = parse(body);
               }
                resolve(data);
            });

            request.on('error', err => {
                reject(err);
            });
        });
    }
}

module.exports = Request
