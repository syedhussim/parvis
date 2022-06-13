
class Validator{

    constructor(){
        this.fields = [];
        this.errors = [];

    }

    add(name,value, validators = []){

        if(typeof value === 'object'){
            value = value[name];
        }
        this.fields.push({
        name :name,
        value :value,
        validators : validators
        });
        return this;
    }

    addError(name, message){

        this.errors.push({
        field :name,
        message :message
        });

        return this;
    }

    isValid(){
        for(let i=0; i < this.fields.length; i++){

            let field = this.fields[i];

            for(let j=0; j <  field.validators.length; j++){

                let validator = field.validators[j];
                validator.value = field.value || '';

                if(!validator.validate()){

                    this.errors.push({
                    field : field.name,
                    message : validator.message,
                    length: validator.length
                    });
                    
                    break;

                }

            }

        }

        if(this.errors.length == 0){
            return true;
        }
        return false;

    }

    hasError(){
        let errors  = new Map()
        if( !this.isValid()){
            for(let error of this.errors){
                if(error.length){
                    errors.set(error.field, error.message, error.length);
                }else{
                    errors.set(error.field, error.message);
                }
            }
        }
        return errors;
    }


}
class EmailValidation {
    constructor(message){
        this.message = message;
        this.value = "";
    }

    validate(){
        if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.value.trim())){
            return true;
        }
            return false;
    }
}
class Required{

    constructor(message){

        this.message = message;
        this.value = '';
    }

    validate(){
        if(this.value.trim().length== 0){
            return false;
        }
        return true;
    }

}

class MaxLength{

    constructor(length, message){
        this.length = length;
        this.message = message;
        this.value = '';
    }

    validate(){

        if(this.value.trim().length > this.length){
            return false;
        }
        return true;
        }

 }

class Length{

    constructor(length, message){
        this.length = length;
        this.message = message;
        this.value ='';
    }

    validate(){
        if(this.value.length != this.length){
            return false;

         }
    return true;
    }

}

module.exports = {Validator, Required , MaxLength, Length, EmailValidation};