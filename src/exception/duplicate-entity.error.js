'use strict'

class DuplicateEntityError extends Error {

    constructor(message, errors) {
        super(message);
        // this.status = 409;
        this.name = this.constructor.name;
        this.errors = errors;
        this.code = 409;
        this.status = 'Failed';
    }

    statusCode() {
        return this.code;
    }
}

module.exports = DuplicateEntityError;