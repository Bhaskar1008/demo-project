'use strict'

class BadRequestError extends Error {

    constructor(message, errors) {
        super(message);
        // this.status = 400;
        this.name = this.constructor.name;
        this.errors = errors;
        this.code = 400;
        this.status = 'Failed';
    }

    statusCode() {
        return this.code;
    }
}

module.exports = BadRequestError;