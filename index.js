"use strict";

const parseArgs = require('./argumentParse');
const { MandatoryNotFoundError } = require("./errors");
const { TYPES, parseValue } = require('./dataParse');

const parsedArgs = parseArgs(process.argv);

class Arment {

    constructor() {

        this.definedArgs = {};

        this.definedArgsValues = {};

        this.outputFunction = console.log;

        this.errorsFound = [];
    }

    get parsedArgs() { return parsedArgs; }

    get TYPES() { return TYPES; }

    get args() { return this.definedArgsValues; }

    set output(func) { this.outputFunction = func; }

    add(name, keys, { optional = true, defaultValue, type = this.TYPES.ANY, desc = "", func = () => false } = {}) {
        if (!name || !keys || !keys.length) return this;

        let value = keys.find((key) => this.parsedArgs[key] || this.parsedArgs.notFlags[key]) || defaultValue;

        if (!optional && value === undefined) this.errorsFound.push(new MandatoryNotFoundError(name));

        let { err, val } = parseValue(name, value, type);
        if (err) this.errorsFound.push(err);

        value = val;
        this.definedArgs[name] = { keys, value, optional, defaultValue, type, desc, func };
        this.definedArgsValues[name] = value;

        func(value, name);

        return this;
    }

    show() {
        let executionBasic = [];
        let executionFull = [];
        let stringDesc = "";
        for (let name in this.definedArgs) {
            let { keys, optional, defaultValue, type, desc } = this.definedArgs[name];

            if (keys.some((key) => !isNaN(key))) {
                if (optional) {
                    executionBasic[keys[0]] = `[<${name}>]`;
                    executionFull[keys[0]] = `[<${name}>]`;
                } else {
                    executionBasic[keys[0]] = `<${name}>`;
                    executionFull[keys[0]] = `<${name}>`;
                }
                continue;
            }

            keys.sort((a, b) => a.length - b.length);

            let keysMapped = keys.map((key) => (key.length === 1) ? `-${key}` : `--${key}`);
            stringDesc += keysMapped.join(" ");
            let forExec = keysMapped.join("|");

            let typeDescriptor = "";
            if (type !== this.TYPES.BOOLEAN) typeDescriptor = ` <${type}>`;
            stringDesc += typeDescriptor;
            forExec += typeDescriptor;

            stringDesc += "\n";

            if (optional) executionFull.push(`[${forExec}]`);
            else {
                executionBasic.push(forExec);
                executionFull.push(forExec);
            }

            let defaultText = "";
            if (defaultValue !== undefined && defaultValue !== null) {
                defaultText = `[default: ${defaultValue}]`;
            }
            stringDesc += `\t\t\t${desc} ${defaultText}\n`;
        }
        let executionBasicText = executionBasic.join(" ");
        let executionFullText = executionFull.join(" ");
        let fullString = "Usage:\n";
        fullString += `node file.js ${executionBasic.join(" ")} [options]\n`;
        if (executionBasicText !== executionFullText) fullString += `node file.js ${executionFull.join(" ")}\n\n`;
        fullString += "Options:\n";
        fullString += stringDesc;

        this.outputFunction(fullString);
    }

    catch(func) { func(this.errorsFound); }
}

module.exports = new Arment();