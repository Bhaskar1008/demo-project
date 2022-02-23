'use strict'

class ValidationError extends Error {

    constructor(message, errors, status) {
        super(message);
        this.name = this.constructor.name;
        this.errors = errors;
        this.code = status || 400;
        this.status = 'Failed';
    }

    statusCode() {
        return this.code;
    }
}

module.exports = ValidationError;