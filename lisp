#!/usr/bin/env node

var fs = require("fs");
var util = require("util");
var lisp = require("./lisp.js");
var vm = require("vm");
var repl = require("repl");
var argv = process.argv;

if (argv.length === 2){
    console.log("lisp2js by Yiyi Wang (shd101wyy) 2015");
    console.log("Interactive Mode");
    console.log("Press ctrl + c to quit\n");
    var input_lines = "";
    var opt = {
        prompt: "> ",
        input: process.stdin,
        output: process.stdout,
        "eval": function(input, context, filename, cb){

            // the below 2 lines of code from coffeescript - repl.js
            input = input.replace(/\uFF00/g, '\n');
            input = input.replace(/^\(([\s\S]*)\n\)$/m, '$1');
            input_lines += input; // add to history.
            var compiled_result = lisp.compile(input_lines);
            if(compiled_result === null){
                opt.prompt = "    ";
                return;
            }
            input_lines = ""; // clear input lines
            opt.prompt = "> ";
            try{
                var result = (context === global) ? (vm.runInThisContext(compiled_result, filename)) : (vm.runInContext(compiled_result, context, filename));
            }
            catch(error){
                console.log(error);
                return cb(error);
            }
            return cb(null, result);
        }
    }

    var lisp2js_repl = repl.start(opt).on("exit", function(){
        console.log("\nquit repl\n");
        process.exit();
    })
    lisp2js_repl.context.vm = vm;
}
