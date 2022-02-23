'use strict'

class RuleViolationError extends Error {

    constructor(message, errors) {
        super(message);
        // this.status = 422;
        this.name = this.constructor.name;
        this.errors = errors;
        this.code = 422;
        this.status = 'Failed';
    }

    statusCode() {
        return this.code;
    }
}

module.exports = RuleViolationError;