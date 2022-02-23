'use strict'
const Validator = require('jsonschema').Validator;
const fs = require('fs');
// const SNSService = require('../service/sns.service')

class BaseManager {

    constructor() {
        this.validator = new Validator();
        // this.snsService = new SNSService();
    }

    /**
     * Logs error
     * @param {object} error 
     */
        
    err(error) {
        console.error(error);
        // this.snsService.publish(process.env.SNS_TOPIC,
            // JSON.stringify({ message: error.message, stack: error.stack }));
    }

    /**
     * Validates data using json schema
     * @param {string} schemaPath Schema file path
     * @param {object} data Data which needs to be validated against schema file.
     */


    validate(schemaPath, data) {
        if (data == null) {
            return {
                valid: false,
                errors: ['Validation failed. Argument should not be null for schema validation.']
            };
        }
        const schema = fs.readFileSync(process.cwd() + schemaPath, 'utf8').toString();
        const result = this.validator.validate(data, JSON.parse(schema));
        const err = this.formatErrors(result);
        return err;
    }

    /**
     * Formats the schema error in agreed format as used in other part of the application.
     * @param {Object} validationResult 
     */
    formatErrors(validationResult) {
        let formattedResult = {};
        formattedResult.valid = validationResult.valid;
        formattedResult.errors = {};
        for (let i = 0; i < validationResult.errors.length; i++) {
            let error = validationResult.errors[i];
            if (error.property.startsWith('instance.')) {
                const field = error.property.replace('instance.', '');
                if (!formattedResult.errors[field]) {
                    formattedResult.errors[field] = [];
                }
                formattedResult.errors[field].push(error.message);
            } else {
                if (!formattedResult.errors[error.argument]) {
                    formattedResult.errors[error.argument] = [];
                }
                formattedResult.errors[error.argument].push(error.message);
            }
        }
        return formattedResult;
    }
}

module.exports = BaseManager;