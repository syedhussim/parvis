module.exports.randomNumber = async function(len){

    const crypto = require('crypto');

    let rand = await new Promise((resolve, reject) => {
        crypto.randomBytes(len, (err, data) => {
            if(err){
                reject(err);
            }else{
                resolve(data);
            }
        });
    });

    const letters = "0123456789";

    let key = '';

    for(let i=0; i < rand.length; i++){
        let idx = rand[i] % letters.length;
        key += idx;
    }

    return key;
};

module.exports.randomKey = function(len){

    const crypto = require('crypto');

    const rand = crypto.randomBytes(len);

    const letters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    let key = '';

    for(let i=0; i < rand.length; i++){
        let idx = rand[i] % letters.length;
        key += letters[idx];
    }

    return key;
};
