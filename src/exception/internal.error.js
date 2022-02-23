'use strict'

class InternalError extends Error {

    constructor(message) {
        super(message);
        this.status = 500;
    }

    statusCode() {
        return this.status;
    }
}

module.exports = InternalError;