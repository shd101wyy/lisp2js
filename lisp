#!/usr/bin/env node

var fs = require("fs");
var util = require("util");
var lisp = require("./lisp.js");
var list = require("./dependencies/list.js");
var vm = require("vm");
var repl = require("repl");
var argv = process.argv;
/*
global.cons = list.cons;
global.car = list.car;
global.cdr = list.cdr;
global.$List = list.$List;
global.list = list.list;
*/
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
                opt.prompt = "... ";
                return;
            }
            input_lines = ""; // clear input lines
            opt.prompt = "> ";
            /*
            try{
                var result = (context === global) ? (vm.runInThisContext(compiled_result, filename)) : (vm.runInContext(compiled_result, context, filename));
                var result = vm.runInContext(compiled_result, global, filename);
                if(result instanceof context.$List)
                    return cb(null, result.toString());
            }
            catch(error){
                console.log(error);
                return cb(error);
            }
            */
            var result = lisp.getEvalResult();
            return cb(null, result);
        }
    }

    var lisp2js_repl = repl.start(opt).on("exit", function(){
        console.log("\nquit repl\n");
        process.exit();
    })
    lisp2js_repl.context.$List = list.$List;
    lisp2js_repl.context.car = list.car;
    lisp2js_repl.context.cdr = list.cdr;
    lisp2js_repl.context.cons = list.cons;
    lisp2js_repl.context.list = list.list;
}
else if (argv.length === 3){
    var file_name = argv[2];
    if(typeof(file_name) === "undefined"){
        console.log("No input file ... ");
        process.exit(0);
    }
    if(file_name.length <= 5 ||
        (file_name.slice(-5) !== ".lisp")){
            console.log("Invalid file name\nPlz use .lisp format. eg test.lisp");
            process.exit(0);
    }
    // get content of file.
    var content_in_file = fs.readFileSync(file_name, "utf8");
    var compiled_result = lisp.compile(content_in_file);
    if(compiled_result === null){
        console.log("ERRPR: () paren doesn't match\n");
        process.exit(0);
    }

    // var context = vm.createContext({cons: list.cons, car: list.car, cdr: list.cdr, "$List": list.$List});
    //vm.runInThisContext(compiled_result, "lisp.vm"); // now running in global scope
}
else if (argv.length === 4){
    var file_name = argv[2];
    if(typeof(file_name) === "undefined"){
        console.log("No input file ... ");
        process.exit(0);
    }
    if(file_name.length <= 5 ||
      (file_name.slice(-5) !== ".lisp")){
          console.log("Invalid file name\nPlz use .lisp format. eg test.lisp");
          process.exit(0);
      }
    // get content of file.
    var content_in_file = fs.readFileSync(file_name, "utf8");
    var compiled_result = lisp.compile(content_in_file);
    if(compiled_result === null){
        console.log("ERRPR: () paren doesn't match\n");
        process.exit(0);
    }
    /*
    try{
        // var context = vm.createContext({cons: list.cons, car: list.car, cdr: list.cdr, "$List": list.$List});
        vm.runInThisContext(compiled_result, "lisp.vm"); // now running in global
    }
    catch(e){
        console.log(e);
        console.log("\n\nCompiled result:\n============");
        console.log(compiled_result);
    }
    */
    console.log("\n\nCompiled result:\n============");
    console.log(compiled_result);

    var save_to_file = argv[3]// file_name.slice(-5) + ".js";

    // if has js-beautify installed
    try{
        var beautify = require("js-beautify").js_beautify;
        var res = beautify(compiled_result);
        fs.writeFile(save_to_file, res, function(error){
            if(error){
                console.log(error)
            }
            else{
                console.log("File: " + save_to_file + " saved!");
            }
        })
    }
    catch(e){
        console.log("\n\n\n");
        console.log(e);
        console.log("You need to install js-beautify to see beautified result\nsee https://www.npmjs.com/package/js-beautify for more information\n\n\n");
        fs.writeFile(save_to_file, compiled_result, function(error){
            if(error){
                console.log(error)
            }
            else{
                console.log("File: " + save_to_file + " saved!");
            }
        })
    }
}
