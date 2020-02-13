class MemoryStore{

    constructor(){
        this._storage = {};
    }

    add(key, value){
        this._storage[key] = value;
    }

    get(key){
        return this._storage[key];
    }

    exist(key){
        return this._storage.hasOwnProperty(key);
    }
}

module.exports = MemoryStore;