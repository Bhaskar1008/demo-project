'use strict'

class DuplicateEntityError extends Error {

    constructor(message) {
        super(message);
        this.status = 409;
    }

    statusCode() {
        return this.status;
    }
}

module.exports = DuplicateEntityError;