"use strict";

const parseArgs = require('./argumentParse');
const { MandatoryNotFoundError, TypeIsIncorrectError } = require("./errors");
// const parseData = require('./dataParse');

class Arment {

    constructor() {

        this.parsedArgs = parseArgs(process.argv);

        this.catchFunction = () => false;

        this.definedArgs = {};

        this.definedArgsValues = {};
    }

    get TYPES() {
        return {
            ANY: "any",
            // BOOLEAN: "boolean",
            // STRING: "string",
            // NUMBER: "number",
            // DATE: "date",
            // OBJECT: "object",
            // ARRAY: "array",
            // FUNCTION: "",
        };
    }

    get args() { return this.definedArgsValues; }

    set catch(func) { this.catchFunction = func; }

    add(name, keys, { optional = true, defaultValue/* , type = this.TYPES.ANY, desc = "", func = () => false */ } = {}) {
        if (!name || !keys || !keys.length) return this;

        let value = keys.find((key) => this.parsedArgs[key] || this.parsedArgs.notFlags[key]) || defaultValue;

        if (!optional && value === undefined) this.catchFunction(new MandatoryNotFoundError(name));

        this.definedArgs[name] = { keys, value, optional, defaultValue /* , type, desc, func */ };
        this.definedArgsValues[name] = value;

        return this;
    }
}
module.exports = new Arment();