'use strict'

class NotFound extends Error {

    constructor(message, errors) {
        super(message);
        // this.status = 404;
        this.name = this.constructor.name;
        this.errors = errors;
        this.code = 404;
        this.status = 'Failed';
    }

    statusCode() {
        return this.code;
    }
}

module.exports = NotFound;