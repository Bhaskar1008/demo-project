'use strict'

class InternalError extends Error {

    constructor(message, errors) {
        super(message);
        this.name = this.constructor.name;
        this.errors = errors;
        this.code = 500;
        this.status = 'Failed';
    }

    statusCode() {
        return this.code;
    }
}

module.exports = InternalError;