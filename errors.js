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
    constructor(name, value, type) {
        super(`${name} parameter: ${value}. Could not be parsed to <${type}>`);
        this.data = { name, value, type };
    }
}

module.exports = { MandatoryNotFoundError, TypeIsIncorrectError };