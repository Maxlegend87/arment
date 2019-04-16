"use strict"
class ArmentError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

class MandatoryNotFoundError extends ArmentError {
    constructor(name) {
        super(`Missing non optional parameter: ${name}.`);
        this.data = { name };
    }
}

class TypeIsIncorrectError extends ArmentError {
    constructor(name, type) {
        super(`${name} parameter could not be parsed to <${type}>`);
        this.data = { name };
    }
}

module.exports = { MandatoryNotFoundError, TypeIsIncorrectError };