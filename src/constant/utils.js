const bcrypt = require('bcryptjs');
class helper_fn {
    constructor (){

    }

    generateUUID(){
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace( /[xy]/g , function(c) {
            var rnd = Math.random()*16 |0, v = c === 'x' ? rnd : (rnd&0x3|0x8) ;
            return v.toString(16);
        });
    }

    generatePassword(str) {
        // return str;
        try {
            if(str) {
                // error
                const salt =  bcrypt.genSaltSync(10);
                return bcrypt.hashSync(str, salt);    
                // return str;
            }
            return undefined;
            // return new NotFound(MSG.NOT_FOUND, 'Not Found');

        } catch (err) {
            throw new InternalError(MSG.INTERNAL_ERROR, 'Password Hash Not Generated');
        }
    }

    async santize_expression_obj(data) {
        var expression_list = [];
        var expression_name = {};
        var expression_value = {};

        // Object.entries(data).forEach()
        await Object.entries(data).map(([key,value], index) => {
            if(value) {
                expression_list.push(`#KEY_${index} = :VALUE_${index}`);
                expression_name[`#KEY_${index}`] = key;
                expression_value[`:VALUE_${index}`] = value;
            }
        });
        return {
            expression_list: expression_list,
            expression_name: expression_name,
            expression_value: expression_value
        }
    }
}

module.exports = helper_fn;