"use strict";

let TYPES = {
    ANY: "any",
    BOOLEAN: "boolean",
    // STRING: "string",
    // NUMBER: "number",
    // DATE: "date",
    // OBJECT: "object",
    // ARRAY: "array",
    // FUNCTION: "",
};

const parseAny = (value) => value;

const parseBoolean = (value) => !(value === "false" || !value);

module.exports = { TYPES };