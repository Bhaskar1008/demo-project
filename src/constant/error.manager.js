'use strict';

class ErrorManager {

    constructor() {
        
    }
    

    static get(msg) {
        
        if (!msg) {
            throw new Error('msg argument is required to set the error.');
        }
        // console.log(msg);

        const result = {
            message: msg.message || msg
        };
        const custom_err_list = [
            'BadRequestError', 
            'DuplicateEntityError', 
            'InternalError', 
            'NotFound', 
            'RuleViolationError', 
            'ValidationError'
        ];

        if (typeof msg == 'object' && custom_err_list.includes(msg.name) && Object.keys(msg.errors).length > 0) {

            result['code'] = msg.statusCode();
            result['status'] = msg.status;
            result['errors'] = msg.errors.errors;
            return result;
        } 
        return result;
    }
}

module.exports = ErrorManager;