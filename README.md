# Arment

A node.js command line parser and checker

## Introduction

This is a module that parses command line arguments. 

Forget those type checks and the comprobation of mandatory arguments. Even the manual documentation is automatically generated.

Lazier to use, easier to read.

## Install

    npm install arment --save

## Usage Examples

> Basic example

    const arment = require("arment");

    //We add the arguments and its config!
    arment
        .add("name", ["n", "name"], { desc: "Human name" })
        .catch((errs) => {
            if(errs.length) console.log(errs[0].message);
            process.exit(-1);
        });
    console.log(arment.args.name);

> Full example

    const arment = require("arment");

    //function to call when the parameter is used on the command line
    const showEaterType = (food) => {
        if (food === "meat") console.log("It is indeed carnivore!");
        else console.log("It is indeed NOT carnivore!");
    };

    const showManual = (help) => {
        if(help){
            arment.show();
            process.exit(0);
        }
    }

    //We add the arguments and its config!
    arment
        .add("type", [0], { optional: false, desc: "Animal type" })
        .add("name", ["n", "name"], { type: arment.TYPES.STRING, defaultValue: "Mark", desc: "Animal name" })
        .add("legs", ["nLegs"], { type: arment.TYPES.NUMBER, defaultValue: 2, desc: "Number of legs" })
        .add("food", ["f", "nomnom"], { type: arment.TYPES.STRING, desc: "Food for nom", func: showEaterType })
        .add("help", ["h", "help"], { desc: "Displays help manual", func: showManual })
        .catch((errs) => {
            if(errs.length) console.log(errs[0].message);
            process.exit(-1);
        });
    //and done!

    //every argument we added can be used via arment.args
    console.log(arment.args.help);
    console.log(arment.args.type);
    console.log(arment.args.name);
    console.log(arment.args.legs);
    console.log(arment.args.food);

    //To get the documentation 
    arment.show();
    /**
     * Usage:
     * node file.js <type> [options]
     * node file.js <type> [-n|--name <string>] [--nLegs <number>] [-f|--nomnom <string>] [-h|--help <any>]
     *
     * Options: 
     * -n --name <string>
     *                         Animal name [default: Mark]
     * --nLegs <number>
     *                         Number of legs of the animal [default: 2]
     * -f --nomnom <string>
     *                         Food for nom 
     * -h --help <any>
     *                         Displays help manual 
     */

## Usage

### add

This is the main tool with [arment](#Arment), just set your variables, and [arment](#Arment) will take care of them.

Variables are created in order, therefore its recommendable to add the manual as the last one if you execute [show](#show) whitin the [ArmentOption](#options) 'func'.

>Any variable added with **add** will be parsed and saved on the [args](#args) property.

|Paramenter|Type|Description|Example|
|--|--|--|--|
|name|string|Name for the variable once got from the arguments|"animal"|
|keys|string[] or number[]|An array of keys that will represent the flags to get the variable|['a','animal']|
|options(`Optional`)|[ArmentOptions](#ArmentOptions)|

Since it returns the [arment](#Arment) object, they can be chained, even ending with a [catch](#catch).

>When you want to use an unflagged argument keys must be an array with only one number, wich will be the position on the **notFlags** array in [parsedArgs](#parsedArgs).

* Example unflagged argument
>
    arment.add("first", [0]);

* Example flagged arguments
>
    //this will take into account -n and --number
    arment.add("number", ["n","number"]);

* Example mandatory argument
>
    arment.add("number", ["n"], { optional: false });

* Example number argument
>
    arment.add("number", ["n"], { type: arment.TYPES.NUMBER });

* Example number argument with default value
>
    arment.add("number", ["n"], { type: arment.TYPES.NUMBER, defaultValue: 3 });

* Example argument with description
> 
    arment.add("number", ["n"], { desc: "This is a number if you set it!" });

* Example argument with function
> 
    arment.add("number", ["n"], { func: (value)=>console.log(\`In number argument, received ${value}\`) });

* Example typical manual
>
    const showManual = (help) => {
        if(help){
            arment.show();
            process.exit(0);
        }
    }

    arment.add("help", ["h", "help"], { desc: "Displays help manual", func: showManual })

### ArmentOptions

|Option|Type|Description|Example|
|--|--|--|--|
|optional|boolean|To tell if the variable is optional|false|
|defaultValue|any|Default value for the variable if its value is not set|""|
|type|string|Any of the [TYPES](#TYPES)|"string"|
|desc|string|Description for the manual ([show](#show))|"If this flag is set, it means it's set"|
|func|Function|A function to apply to the variable value when it is added|(value, name)=>console.log(\`In ${name}, received ${value}\`)|

### show

When this function is called, a manual for the script arguments defined with [add](#add) will be shown via the [output](#output) function.

    //node file.js --nomnom cheese

    arment.add("food", ["f", "nomnom"]);

    arment.show();
    /**
     * Usage:
     * node file.js [options]
     * node file.js [-f|--nomnom <string>]
     *
     * Options: 
     * -f --nomnom <string>
     *                         Food for nom 
     */

### parsedArgs

When [arment](#Arment) is required, will automatically read the command line arguments.

You can get them parsed in an object with the **parsedArgs** property.

    //node script.js argument -l --banana 

    console.log(arment.parsedArgs); //{ notFlags: ["argument"], banana: true }

>All arguments passed without flag, will be pushed to the **notFlags** array

### TYPES

In order to parse, [arment](#Arment) has a set of variable types to parse the argument when indicated.

You can get the possible types in an object with the **TYPES** property.

    console.log(arment.TYPES);
    /**
    *{
    *    ANY: "any",
    *    BOOLEAN: "boolean",
    *    STRING: "string",
    *    NUMBER: "number",
    *    DATE: "date",
    *    OBJECT: "object",
    *    ARRAY: "array",
    *}
    */

### args

Whenever you [add](#add) a new [arment](#Arment) variable, its name parameter will be added to the **args** property with its value.

    //node file.js --nomnom cheese

    arment
        .add("food", ["f", "nomnom"]);

    console.log(arment.args);//{ food: "cheese" } 

### catch

Whenever you [add](#add) a new [arment](#Arment) variable, it will be checked with its [ArmentOptions](#options). If certain variable conditions are not met, errors will be generated.

Cases:
* A variable is set to non optional and no value was found
* A variable value could not be parsed to the defined type from [TYPES](#TYPES)

|Paramenter|Type|Description|Example|
|--|--|--|--|
|func|Function|function to catch the errors|console.log|

    arment.catch((errs) => {
        if(errs.length) console.log(errs[0].message);
        process.exit(-1);
    });

### output

This is the function that will be used when [show](#show) is called.

Default function is 'console.log'. You can set your custom **output** function with its setter.

    const showText= (text) => {
        console.log("This is my manual!");
        console.log(text);
        process.exit(-1);
    };

    arment.output = showText;

## License

MIT
