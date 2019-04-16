"use strict";

//Argument parsing
const hasDash = (string) => /^-/.test(string);
const hasDoubleDash = (string) => /^--/.test(string);
const hasEqual = (string) => /=/.test(string);

const parseDoubleHashed = (arg, next, parsedArgs) => {
    arg = arg.slice(2);
    const [key, value] = arg.split("=");
    if (hasEqual(arg)) parsedArgs[key] = value;
    else if (!next || hasDash(next)) parsedArgs[arg] = true;
    else parsedArgs[arg] = next;
    return parsedArgs[arg];
};

const parseSimpleHashed = (arg, next, parsedArgs) => {
    arg = arg.slice(1);
    const lastChar = arg.slice(-1);
    for (let char of arg) parsedArgs[char] = true;
    if (next && !hasDash(next)) parsedArgs[lastChar] = next;
    return parsedArgs[lastChar];
};

const parseArgs = (commandArgs) => {
    let parsedArgs = { notFlags: [] };
    for (let i = 2, length = commandArgs.length; i < length; i++) {
        const nextArg = commandArgs[i + 1];
        const actualArg = commandArgs[i];
        let skipNext = false;

        if (hasDoubleDash(actualArg)) skipNext = parseDoubleHashed(actualArg, nextArg, parsedArgs) === nextArg;
        else if (hasDash(actualArg)) skipNext = parseSimpleHashed(actualArg, nextArg, parsedArgs) === nextArg;
        else parsedArgs.notFlags.push(actualArg);

        if (skipNext) i++;
    }
    return parsedArgs;
};

module.exports = parseArgs;