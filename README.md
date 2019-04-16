# Arment

A node.js command line parser and checker

## Introduction

This is a module that parses command line arguments. 

Forget those type checks and the comprobation of mandatory arguments. Even the manual documentation is automatically generated.

Lazier to use, easier to read.

## Install

    npm install arment --save

## Example

> Basic example

    const arment = require("arment");

    //function to call in case of an error(for example, a number argument that could not be parsed to number)
    arment.catch = (err) => {
        console.log(err);
        process.exit(-1);
    };

    //We add the arguments and its config!
    arment
        .add("name", ["n", "name"], { type: arment.TYPES.STRING, defaultValue:"Mark", desc: "Human name" })
        .add("help", ["h", "help"], { desc: "Displays help manual", func: arment.show });

> Full example

    const arment = require("arment");

    //function to call when the parameter is used on the command line
    const showEaterType = (food) => {
        if (food === "meat") console.log("It is indeed carnivore!");
        else console.log("It is indeed NOT carnivore!");
    };

    //function to call in case of an error(for example, a number argument that could not be parsed to number)
    const argumentError= (err) => {
        console.log(err);
        process.exit(-1);
    };

    arment.catch = argumentError;

    //We add the arguments and its config!
    arment
        .add("type", [0], { optional: false, desc: "Animal type" })
        .add("name", ["n", "name"], { type: arment.TYPES.STRING, defaultValue: "Mark", desc: "Animal name" })
        .add("legs", ["nLegs"], { type: arment.TYPES.NUMBER, defaultValue: 2, desc: "Number of legs" })
        .add("food", ["f", "nomnom"], { type: arment.TYPES.STRING, desc: "Food for nom", func: showEaterType })
        .add("help", ["h", "help"], { desc: "Displays help manual", func: arment.show });
    //and done!

    //every argument we added can be used via arment.args
    console.log(arment.args.type);
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

### parsedArgs

When **arment** is required, will automatically parse the command line arguments.

You can get them parsed in JSON with the property **parsedArgs**.

    //node script.js argument -l --banana 

    console.log(arment.parsedArgs); //{ notFlags: ["argument"], banana: true }

>All arguments passed without flag, will be pushed to the **notFlags** array

## License

MIT