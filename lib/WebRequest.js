const https = require('https');
const http = require('http');

class WebRequest{

    async execute(options, postData, responseHeaders = false, usehttps = false){ 

        let client = options.port == 443 ? https : http;
        
        if(usehttps){
            client = https;
        }

        let result = await new Promise((resolve, reject) => {
            const req = client.request(options, (response) => {

                let data = '';

                response.on('data', (chunck) => {
                    data += chunck.toString('UTF8');
                });

                response.on('end', () => {
                    resolve({ status: response.statusCode, headers : response.headers, data : data });
                });
            });

            req.on('error', function(err){
                reject(err);
            });

            if(postData){
                req.write(postData);
            }
            
            req.end();
        });

        if(responseHeaders){
            return {
                status : result.status,
                headers : result.headers,
                data : result.data
            }
        }
        return result.data;
    }
}

module.exports = WebRequest;