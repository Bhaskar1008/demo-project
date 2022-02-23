'use strict'

class BadRequestError extends Error {

    constructor(message) {
        super(message);
        this.status = 400;
    }

    statusCode() {
        return this.status;
    }
}

module.exports = BadRequestError;