"use strict";
const { TypeIsIncorrectError } = require("./errors");

let TYPES = {
    ANY: "any",
    BOOLEAN: "boolean",
    STRING: "string",
    NUMBER: "number",
    DATE: "date",
    OBJECT: "object",
    ARRAY: "array",
};

const parseAny = (value) => value;

const parseBoolean = (value) => !(value === "false" || !value);

const parseString = (value) => (value === true) ? "" : (value || "");

const parseNumber = (value) => value * 1;

const parseDate = (value) => {
    if (!value) return null;

    let [date, time] = value.split("T");

    if (!date) return null;

    let [year, month, day] = date.split("-");

    if (!year || !month || !day) return null;

    if (!time) return new Date(year, month, day);

    let [hours, minutes, seconds] = time.split(":");

    if (!hours || !minutes || !seconds) return null;

    return new Date(year, month, day, hours, minutes, seconds);
};

const parseObject = (value) => {
    try { return JSON.parse(value); }
    catch (err) { return null; }
};

const parseArray = (value) => {
    let array = parseObject(value);
    if (array && Array.isArray(array)) return array;
    return null;
};

const parseValue = (name, value, type) => {
    let err = null;
    let val = undefined;

    if (type === TYPES.ANY) val = parseAny(value);
    else if (type === TYPES.BOOLEAN) val = parseBoolean(value);
    else if (type === TYPES.STRING) val = parseString(value);
    else if (type === TYPES.NUMBER) {
        val = parseNumber(value);
        if (isNaN(val)) err = new TypeIsIncorrectError(name, value, type);
    }
    else if (type === TYPES.DATE) val = parseDate(value);
    else if (type === TYPES.OBJECT) val = parseObject(value);
    else if (type === TYPES.ARRAY) val = parseArray(value);

    if (val === null) err = new TypeIsIncorrectError(name, value, type);

    return { err, val };
};

module.exports = { TYPES, parseValue };