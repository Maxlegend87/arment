"use strict";

const parseArgs=require('./argumentParse');

class Arment {

    constructor() {

        this.parsedArgs = parseArgs(process.argv);

    }

}
module.exports = new Arment();