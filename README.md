# Arment

A node.js command line parser and checker

## Introduction

This is a module that parses command line arguments. 

You set the arguments to take into account and its settings if you need them. The rest is not your job. 

Lazier to use, easier to read.

## Usage

First, install the package using npm:

    npm install arment --save

>Basic example

    const arment = require("arment");

    //function to call when the parameter is used on the command line
    const showEaterType = (food) => food === "meat" ? console.log("It is indeed carnivore!") : console.log("It is indeed NOT carnivore!")

    //function to call in case of an error(for example, a number argument that could not be parsed to number)
    arment.errorFunc = (err) => {
        console.log(err);
        process.exit(-1);
    };

    //We add the arguments and its config!
    arment
        .add("type", [0], { optional: false, desc: "Animal type" })
        .add("name", ["n", "name"], { type: arment.TYPES.STRING, defaultValue:"Mark", desc: "Animal name" })
        .add("legs", ["l", "legs", "nLegs"], { type: arment.TYPES.NUMBER, defaultValue: 2, desc: "Number of legs of the animal" })
        .add("food", ["f", "nomnom"], {type: arment.TYPES.STRING, desc: "Food eaten by the animal", func: showEaterType })
        .add("help", ["h", "help"], { desc: "Displays help manual", func: arment.show });

    //and done!

    //every argument we added can be used via arment.args
    console.log(arment.args.type)
    console.log(arment.args.food)

    //for example if we do this
    arment.show();
    /**
    * Gives us this:
    * Usage:
    * node file.js <type> [options]
    * node file.js <type> [-n|--name <string>] [-l|--legs|--nLegs <number>] [-f|--nomnom <string>] [-h|--help <any>]
    *
    * Options: 
    * -n --name <string>
    *                         Animal name [default: Mark]
    * -l --legs --nLegs <number>
    *                         Number of legs of the animal [default: 2]
    * -f --nomnom <string>
    *                         Food eaten by the animal 
    * -h --help <any>
    *                         Displays help manual 
    */

## License

MIT
