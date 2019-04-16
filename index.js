"use strict";

const parseArgs = require('./argumentParse');
const { MandatoryNotFoundError } = require("./errors");
const { TYPES, parseValue } = require('./dataParse');

class Arment {

    constructor() {

        this.parsedArgs = parseArgs(process.argv);

        this.catchFunction = () => false;

        this.definedArgs = {};

        this.definedArgsValues = {};
    }

    get TYPES() { return TYPES; }

    get args() { return this.definedArgsValues; }

    set catch(func) { this.catchFunction = func; }

    add(name, keys, { optional = true, defaultValue, type = this.TYPES.ANY, desc = "", func = () => false } = {}) {
        if (!name || !keys || !keys.length) return this;

        let value = keys.find((key) => this.parsedArgs[key] || this.parsedArgs.notFlags[key]) || defaultValue;

        if (!optional && value === undefined) this.catchFunction(new MandatoryNotFoundError(name));

        let { err, val } = parseValue(name, value, type);
        if (err) this.catchFunction(err);

        value = val;
        this.definedArgs[name] = { keys, value, optional, defaultValue, type, desc, func };
        this.definedArgsValues[name] = value;

        func(value);

        return this;
    }
}
module.exports = new Arment();