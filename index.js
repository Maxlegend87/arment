"use strict";

const parseArgs = require('./argumentParse');
const { MandatoryNotFoundError, TypeIsIncorrectError } = require("./errors");

class Arment {

    constructor() {

        this.parsedArgs = parseArgs(process.argv);

        this.catchFunction = () => false;
    }

    set catch(func) { this.catchFunction = func; }

}

module.exports = new Arment();