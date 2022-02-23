'use strict'

class RuleViolationError extends Error {

    constructor(message) {
        super(message);
        this.status = 422;
    }

    statusCode() {
        return this.status;
    }
}

module.exports = RuleViolationError;