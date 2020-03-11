class MimeTypes{

    static get(ext){
        let types = {
            gif : { mime : 'image/gif', type : 1},
            css : { mime : 'text/css', type : 2},
            js : { mime : 'application/javascript', type : 2}
        }

        return types[ext];
    }
}

module.exports = MimeTypes;