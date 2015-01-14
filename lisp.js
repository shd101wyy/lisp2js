/*
 *
 *  Simple Lisp to JavaScript compiler
 *
 */
var node_environment = false;
var vm = null;
if(typeof(module) != "undefined"){ // nodejs
    vm = require("vm");
    node_environment = true;
}


var $List,car,cdr,cons,list,list_module,__slice=[].slice;
list_module=function(){var d,e,f;d=function(b,a){this.first=b;this.rest=a;return null};d.prototype.length=function(){var b;b=function(a,c){return null===a?c:b(a.rest,c+1)};return b(this,0)};d.prototype.toString=function(){var b;b=function(a,c){return null===a?c+")":a instanceof d?b(a.rest,c+(null===a.first?"()":a.first.toString())+(null===a.rest?"":", ")):c.slice(0,-2)+" . "+a.toString()+")"};return b(this,"(")};d.prototype.reverse=function(){var b;b=function(a,c){return a instanceof d?b(a.rest,e(a.first,
     c)):null===a?c:e(a,c)};return b(this,null)};d.prototype.slice=function(b,a){var c,d,f;null==a&&(a=null);if(null===a)return 0>b&&(b=this.length()+b),d=function(a,b){return 0===b?a:d(a.rest,b-1)},d(this,b);if(0>b||0>a)c=this.length(),b=0>b?c+b:b,a=0>a?c+a:a;f=function(a,b,c){return 0===b?0===c||null===a?null:e(a.first,f(a.rest,b,c-1)):f(a.rest,b-1,c)};return f(this,b,a-b)};d.prototype.ref=function(b){var a;0>b&&(b=this.length()+b);a=function(b,d){return null===b?null:0===d?b.first:a(b.rest,d-1)};return a(this,
         b)};d.prototype.append=function(){var b,a;a=1<=arguments.length?__slice.call(arguments,0):[];a=f.apply(f,a);b=function(a,d){return null===a?d:e(a.first,b(a.rest,d))};return b(this,a)};d.prototype.toArray=function(){var b,a;b=[];a=function(c){if(null===c)return b;b.push(c.first);return a(c.rest)};return a(this)};d.prototype.forEach=function(b){var a;a=function(c){if(null===c)return null;b(c.first);return a(c.rest)};return a(this)};d.prototype.foreach=d.prototype.forEach;d.prototype.map=function(b){var a;
             a=function(c){return null===c?null:e(b(c.first),a(c.rest))};return a(this)};d.prototype.filter=function(b){var a;a=function(c){return null===c?null:b(c.first)?e(c.first,a(c.rest)):a(c.rest)};return a(this)};e=function(b,a){return new d(b,a)};f=function(){var b,a;b=1<=arguments.length?__slice.call(arguments,0):[];a=function(b,d){return d===b.length?null:e(b[d],a(b,d+1))};return a(b,0)};return{list:f,cons:e,List:d,car:function(b){return b.first},cdr:function(b){return b.rest}}}();$List=list_module.List;
             list=list_module.list;cons=list_module.cons;car=list_module.car;cdr=list_module.cdr;"undefined"!==typeof module&&(module.exports.$List=$List,module.exports.list=list,module.exports.cons=cons,module.exports.car=car,module.exports.cdr=cdr);

/*
 * ########################################
 * ########################################
 * ########################################
 *  lisp module
 * ########################################
 * ########################################
 * ########################################
 */
var lisp_module = function() {
    var lexer, parser, compiler, lisp_compiler;
    var macros = {}; // used to save macro
    var GET_DOT = 1;
    var eval_result = "";
    var global_context = null;
    var recursion_function_name_count = 0;
    var append = function(x, y){ // (x y) (z w) => (x y z w)
        if(x === null)
            return (y instanceof $List || y === null) ? y : cons(y, null);
        return cons(x.first, append(x.rest, y));
    }
    if(node_environment){ // run under nodejs env
        // create global context
        var sandbox = {cons: cons, car: car, cdr: cdr, list: list, $List: $List, append: append, console: console}
        global_context = vm.createContext(sandbox);
        // console.log(vm.runInContext("[1, 2, 3] instanceof Array", global_context, "repl"));
    }
    else{
        window.append = append;
    }
    lexer = function(input_string) {
        var output_list = [];
        var paren_count = 0;
        var getIndexOfValidStr = function(input_string, end) {
            while (1) {
                if (end === input_string.length || input_string[end] === " " || input_string[end] === "\n" || input_string[end] === "\t" || input_string[end] === "," || input_string[end] === ")" || input_string[end] === "(" || input_string[end] === "]" || input_string[end] === "[" || input_string[end] === "{" || input_string[end] === "}" || input_string[end] === "\'" || input_string[end] === "`" || input_string[end] === "~" || input_string[end] === ";" || input_string[end] === ":") break;
                end += 1;
            }
            return end;
        }
        for (var i = 0; i < input_string.length; i++) {
            if (input_string[i] === "(") {
                var v;
                output_list.push("(");
                paren_count++;
            } else if (input_string[i] === "[") {
                if (i != 0 &&
                    (input_string[i - 1] !== ' ' && input_string[i - 1] !== '\n' && input_string[i - 1] !== '\t' && input_string[i - 1] !== '\'' && input_string[i - 1] !== '`'
                    && input_string[i - 1] !== '~' && input_string[i - 1] !== '(' && input_string[i - 1] !== '{' && input_string[i - 1] !== '[')) {
                    j = output_list.length - 1;
                    p = (output_list[j] === ")") ? 1 : 0;
                    if (p == 0) { // x[0]
                        output_list.push("array-object-get");
                        output_list.push(output_list[j]);
                        output_list[j] = "(";
                    } else { // x[1]
                        output_list.push(""); // save space;
                        output_list.push(""); // save space;
                        output_list[j + 2] = output_list[j];
                        j = j - 1;
                        while (1) {
                            output_list[j + 2] = output_list[j];
                            if (output_list[j] === ")")
                                p++;
                            if (output_list[j] === "(")
                                p--;
                            if (p == 0)
                                break;
                            j--;
                        }
                        output_list[j] = "(";
                        output_list[j + 1] = "array-object-get";
                    }
                } else {
                    output_list.push("(");
                    output_list.push("Array");
                }
                paren_count++;
            } else if (input_string[i] === "{") {
                output_list.push("(");
                output_list.push("Object");
                paren_count++;
            } else if (input_string[i] === ")" || input_string[i] === "]" || input_string[i] === "}") {
                output_list.push(")");
                paren_count--;
            } else if (input_string[i] === " " || input_string[i] === "\n" || input_string[i] == "\t" || input_string[i] == ",") {
                continue;
            } else if (input_string[i] === "~" && input_string[i + 1] === "@") {
                output_list.push("~@");
                i++;
            } else if (input_string[i] === "`" || input_string[i] === "~" || input_string[i] === "'") {
                output_list.push(input_string[i]);
            } else if (input_string[i] === ";") { // comment
                while (i != input_string.length) {
                    if (input_string[i] === "\n") break;
                    i++;
                }
            } else if (input_string[i] === '"') { // string
                var a = i + 1;
                while (a != input_string.length) {
                    if (input_string[a] === "\\") {
                        a += 2;
                        continue;
                    }
                    if (input_string[a] === '"') break;
                    a++
                }
                output_list.push(input_string.slice(i, a + 1));
                i = a;
            } else {
                var end = getIndexOfValidStr(input_string, i + 1);
                var t = input_string.slice(i, end);

                // check exp like [0].x
                if(t[0] === "." && output_list[output_list.length - 1] === ")"){
                    var p = 1;
                    var j = output_list.length - 1;
                    output_list.push(""); // save space;
                    output_list.push(""); // save space;
                    output_list.push(""); // save space;
                    output_list[j + 3] = output_list[j];
                    j = j - 1;
                    while (1) {
                        output_list[j + 3] = output_list[j];
                        if (output_list[j] === ")")
                            p++;
                        if (output_list[j] === "(")
                            p--;
                        if (p == 0)
                            break;
                        j--;
                    }
                    output_list[j] = "(";
                    output_list[j + 1] = GET_DOT;
                    output_list[j + 2] = t;

                    output_list.push(")");
                }
                else
                    output_list.push(t);
                i = end - 1;
            }
        }
        // error, parent doesn't match
        if (paren_count != 0) {
            return null;
        }
        return output_list;
    }

    parser = function(l) {
        var parser_get_tag = {
            "'": "quote",
            "~": "unquote",
            "~@": "unquote-splice",
            "`": "quasiquote"
        }
        if (l === null) // lexer failure
            return null;
        var current_list_pointer = null;
        var i, j;
        var lists = null;
        var temp = null;
        var t = null;
        for (i = l.length - 1; i >= 0; i--) {
            if (l[i] === ")") {
                lists = cons(current_list_pointer, lists); // save current lists
                current_list_pointer = null; // reset current_list_pointer
            } else if (l[i] === "(") {
                if (i != 0 &&
                    (l[i - 1] === "~@" || l[i - 1] === "'" || l[i - 1] === "~" || l[i - 1] === "`")) {
                    current_list_pointer = cons(cons(parser_get_tag[l[i - 1]],
                            cons(current_list_pointer, null)),
                        car(lists));
                    i--;
                } else {
                    current_list_pointer = cons(current_list_pointer, car(lists)); // append list
                }
                temp = lists;
                lists = cdr(lists);
            } else {
                var temp = l[i];
                if (i != 0 &&
                    (l[i - 1] === "~@" || l[i - 1] === "'" || l[i - 1] === "~" || l[i - 1] === "`")) {
                    current_list_pointer = cons(cons(parser_get_tag[l[i - 1]],
                            cons(temp,
                                null)),
                        current_list_pointer);
                    i--;
                } else {
                    current_list_pointer = cons(temp, current_list_pointer);
                }
            }
        }
        return current_list_pointer;
    }

    var quote_list = function(l) {
        if (l == null) return null;
        var v = l.first;
        if (v instanceof $List) return cons("cons",
            cons(quote_list(v),
                cons(quote_list(l.rest),
                    null)));
        else if (typeof(v) === "string" && v === ".")
            return cons("quote", cons(l.rest.first, null));
        else
            return cons("cons",
                cons(cons("quote", cons(v, null)),
                    cons(quote_list(cdr(l)), null)));
    }

    // validate variable name.
    var validateName = function(var_name) {
        var o = "";
        for (var i = 0; i < var_name.length; i++) {
            var code = var_name.charCodeAt(i);
            if ((code > 47 && code < 58) || // numeric (0-9)
                (code > 64 && code < 91) || // upper alpha (A-Z)
                (code > 96 && code < 123) || // lower alpha (a-z)
                var_name[i] === "$" ||
                var_name[i] === "_" ||
                var_name[i] === ".") {
                o += var_name[i];
            } else {
                o += "_$" + code + "_";
            }
        }
        if (!isNaN(o[0])) o =  "_" + o ; // first letter is number, add _ ahead.
        return o;
    }

    var quasiquote_list = function(l) {
        if (l == null) {
            return null;
        }
        v = l.first;
        if (v instanceof $List) {
            if (typeof(v.first) === "string" && v.first === "unquote") {
                return cons("cons",
                    cons(v.rest.first,
                        cons(quasiquote_list(cdr(l)),
                            null)));
            } else if (typeof(v.first) == "string" && v.first === "unquote-splice") {
                return cons("append",
                    cons(v.rest.first,
                        cons(quasiquote_list(l.rest),
                            null)));
            }
            return cons("cons",
                cons(quasiquote_list(v),
                    cons(quasiquote_list(l.rest), null)));
        } else if (typeof(v) === "string" && v === ".")
            return cons("quote", cons(l.rest.first, null));
        else
            return cons("cons",
                cons(cons("quote",
                        cons(v, null)),
                    cons(quasiquote_list(l.rest),
                        null)));
    }

    var macro_match = function(a, b, result) {
        if (a === null && b === null)
            return result;
        else if ((a === null && b !== null) || (a !== null && b === null && a.first !== ".")) {
            return 0; // doesn't match
        } else if (a.first instanceof $List && b.first instanceof $List) {
            var match = macro_match(a.first, b.first, result);
            if (!match)
                return 0; // doesn't match
            return macro_match(a.rest, b.rest, result);
        } else if (a.first instanceof $List && !(b.first instanceof $List)) {
            return 0; // doesn't match
        } else {
            if (typeof(a.first) === "string" && a.first[0] === "#") {
                // constant
                if (typeof(b.first) !== "string") {
                    return 0; // doesn't match
                }
                if (a.first.slice(1) === b.first)
                    return macro_match(a.rest, b.rest, result);
                else
                    return 0;
            } else if (typeof(a.first) === "string" && a.first === ".") {
                result[a.rest.first] = b;
                return result;
            } else {
                result[a.first] = b.first;
                return macro_match(a.rest, b.rest, result);
            }
        }
    }
    var macro_expand = function(clauses, exp) {
        var formatList = function(l){ // add "" to values.
            if (l === null)
                return null;
            else if (l.first instanceof $List){
                return cons(formatList(l.first), formatList(l.rest));
            }
            else
                return cons('"' + l.first + '"', formatList(l.rest));
        }
        while (clauses != null) {
            var match = macro_match(clauses.first,
                exp, {})
            if (match) { // match
                //console.log(match);
                //console.log(compiler(clauses.rest.first));
                var eval_macro = "(function(){";
                for (key in match) {
                    if(match[key] instanceof $List){
                        eval_macro += ("var " + key + " = " + compiler(cons("list", formatList(match[key]))) + "; ");
                    }
                    else
                        eval_macro += ("var " + key + " = " + compiler('"' + match[key]) + '"' + "; ");
                }
                eval_macro += ("return (" + compiler(clauses.rest.first) + ");");
                eval_macro += "})();";
                if(node_environment)
                    try{
                        var result = vm.runInContext(eval_macro, global_context, "lisp.vm");
                        return result;
                    }
                    catch(e){
                        console.log(e);
                        return "";
                    }

                else
                    try{
                        return window.eval(eval_macro);
                    }
                    catch(e){
                        alert(e);
                        return "";
                    }
            }
            clauses = clauses.rest.rest;
        }
        console.log("ERROR: Failed to expand macro\n");
        return "";
    }

    var formatParams = function(params) {
        var o = "(";
        while (params != null) {
            var p = params.first;
            p = compiler(p, null, null, null, true);
            if (typeof(p) === "string" && p[0] === ":") {
                o += (p.slice(1) + "=");
            } else {
                o += p;
                if (params.rest != null)
                    o += ", ";
            }
            params = params.rest;
        }
        o += ")";
        return o;
    }
    compiler = function(l, is_last_exp, is_recur, need_return_string, param_or_assignment) {
        if (l === null)
            return (need_return_string) ? "return null" : "null";
        else if (l instanceof $List) {
            var tag = car(l);
            if (tag === "def" || tag === "=" || tag === "set!" || tag === "const") {
                var var_name = car(cdr(l));
                var var_value = null;
                if (cdr(cdr(l)) === null)
                    var_value = null;
                else if (tag === "def" && cdr(cdr(cdr(l))) != null)
                    var_value = cons("fn", cons(car(cdr(cdr(l))),
                        cdr(cdr(cdr(l)))));
                else
                    var_value = l.rest.rest.first;
                
                var_name = compiler(var_name); 
                var_value = compiler(var_value, null, null, null, true); // param_or_aasignment
                var o = (tag === "def" ? "var " : (tag === "const" ? "const " : "")) + var_name + " = " + var_value + " ";
                return (need_return_string) ? o + "; return " + var_name : o;
            } else if (tag === "Array") { // array
                var o = need_return_string ? "return [" : "[";
                l = cdr(l);
                while (l != null) {
                    o += (compiler(car(l)));
                    if (cdr(l) != null)
                        o += ", ";
                    l = cdr(l);
                }
                o += "]";
                return o;
            } else if (tag === "Object") { // object
                var o = need_return_string ? "return {" : "{";
                l = l.rest;
                while (l != null) {
                    var key = compiler(l.first);
                    if (key[0] === ":") {
                        if (l.rest !== null && l.rest.first[0] !== ":")
                            o += (key.slice(1) + ": ");
                        else { // {:a :b}  => {a, b}
                            o += (key.slice(1) + (l.rest == null ? "" : ", "));
                            l = l.rest;
                            continue;
                        }
                    } else if (key[0] === "'" || key[0] === "\"")
                        o += (key + ": ");
                    else
                        o += ("[" + key + "]: ")

                    var value = compiler(l.rest.first);
                    o += (value);
                    if (l.rest.rest != null)
                        o += ", ";
                    l = l.rest.rest;
                }
                o += "}";
                return o;
            } else if (tag === "array-object-get") { // x[0] =? [[ x 0
                return compiler(l.rest.first) + "[" + compiler(l.rest.rest.first) + "]";
            } else if (tag === GET_DOT){ // x[0].a
                return compiler(l.rest.rest.first) + compiler(l.rest.first);
            } else if (tag === "quote" || tag === "quasiquote") {
                if (l.rest.first instanceof $List) {
                    var v = compiler(tag === "quote" ? quote_list(l.rest.first) : quasiquote_list(l.rest.first)); 
                    return need_return_string ? "return " + v : v;
                } else if (l.rest === null) {
                    return need_return_string ? "return null" : "null";
                } else {
                    if (isNaN(l.rest.first)) // not a number
                        return need_return_string ? "return " + '"' + l.rest.first + '"' : '"' + l.rest.first + '"';
                    else
                        return need_return_string ? "return " + l.rest.first : l.rest.first;
                }
            } else if (tag === "fn" || tag === "fn*") {
                var o = tag === "fn" ? "function " : "function* "; // o is part ahead (){}
                if(need_return_string) o = "return " + o;
                var o2 = "";                                       // o2 is (){}
                var params, body;
                if(typeof(l.rest.first) === "string"){ // solve ((function test (){})()) problem
                    o2 += (l.rest.first + "(");
                    params = l.rest.rest.first;
                    body = l.rest.rest.rest;
                }
                else{
                    o2 += "(";
                    params = l.rest.first;
                    body = l.rest.rest;
                }
                while (params != null) {
                    var p = params.first;
                    p = compiler(p);
                    if (p[0] === ":") {
                        o2 += (p.slice(1) + "=");
                    } else if (p === ".") { // ecmascript 6 rest parameters
                        params = params.rest;
                        o2 += ("..." + compiler(params.first));
                    } else if (p === ".list"){  // es6 rest parameters. convert to list
                        params = params.rest;
                        var p = compiler(params.first);
                        o2 += ("..." + p);
                        body = cons(list("=", p, list(p+".toList")), body) // convert from arry to list
                    } else {
                        o2 += p;
                        if (params.rest != null)
                            o2 += ", ";
                    }
                    params = params.rest;
                }
                var is_recur = [false];
                o2 += "){";
                o2 += lisp_compiler(body, true, null, is_recur);
                o2 += "}";
                if(is_recur[0] !== false){ // is recur
                    o += is_recur[0];
                }
                return o + o2;
            }
            /*
             * (let x 1 y 2 body)
             * => // {let x = 1; let y = 2; ...} deprecated
             * => ((function(){var x = 1; var y = 2; body...}))
             */
            else if (tag === "let") {
                var vars = {};
                var params = cdr(l);
                var o = "((function(){";
                while (params.rest != null) {
                    var var_name = params.first;
                    var var_val = params.rest.first;

                    if (typeof(var_name === "string")) {
                        if (var_name in vars) {
                            o += (var_name + " = " + compiler(var_val) + "; ");
                        } else {
                            vars[var_name] = true;
                            o += ("var " + var_name + " = " + compiler(var_val) + "; ");
                        }
                    } else {
                        console.log("let implementation not finished yet");
                    }
                    params = params.rest.rest;
                }

                if (params.first instanceof $List && params.first.first === "do") {
                    o += lisp_compiler(params.first.rest, true);
                } else
                    o += ("return " + compiler(params.first));
                o += "})())"
                if (need_return_string) o = "return " + o;
                return o; //+ "}";
            }
            else if (tag === "cond"){
                var find_else = false;
                var clauses = l.rest;
                var o = "if(";
                if(param_or_assignment)
                    o = "(function(){" + o;
                var test = compiler(clauses.first);
                o = o + test + "){";
                var body = clauses.rest.first;
                if(body instanceof $List && body.first === "do"){
                    o += lisp_compiler(body.rest, need_return_string || param_or_assignment ? true: false, false, is_recur);
                }
                else{
                    o += lisp_compiler(cons(body, null), need_return_string || param_or_assignment ? true: false, false, is_recur);
                }
                o += "}"
                clauses = clauses.rest.rest;
                while(clauses != null){
                    o += " else ";
                    if(clauses.first !== "else"){ // else if
                        o += "if ("
                        test = compiler(clauses.first);
                        o = o + test + "){"
                        body = clauses.rest.first;
                        if(body instanceof $List && body.first === "do"){
                            o += lisp_compiler(body.rest, need_return_string || param_or_assignment ? true: false, false, is_recur);
                        }
                        else{
                            o += lisp_compiler(cons(body, null), need_return_string || param_or_assignment ? true: false, false, is_recur);
                        }
                        o += "}"
                        clauses = clauses.rest.rest;
                    }
                    else{
                        find_else = true;
                        o += "{"
                        body = clauses.rest.first;
                        if(body instanceof $List && body.first === "do"){
                            o += lisp_compiler(body.rest, need_return_string || param_or_assignment ? true: false, false, is_recur);
                        }
                        else{
                            o += lisp_compiler(cons(body, null), need_return_string || param_or_assignment ? true: false, false, is_recur);
                        }
                        o += "}"
                        break;
                    }
                }
                if(find_else === false && need_return_string){
                    o += " else return null";
                }
                if(param_or_assignment)
                    o = o + "})()"
                return o;
            }
            /*
             *  (if a b c) => ((a) ? (b) : (c));
             */
            else if (tag === "if") {
                var o = "(";
                var test = l.rest.first;
                var conseq = l.rest.rest.first;
                var alter = l.rest.rest.rest === null ? null : l.rest.rest.rest.first;
                if(param_or_assignment){
                    o += (compiler(test) + " ? ");
                    // check last exp and recur.
                    if(is_last_exp &&
                        (   (conseq instanceof $List && conseq.first === "recur" )
                         || (alter && alter instanceof $List && alter.first === "recur"))){  // recursion, last call.
                            if(is_recur[0] === false){
                                is_recur[0] = "__lisp__recur__$" + recursion_function_name_count; // last exp;
                                recursion_function_name_count+=3;
                            }
                            if(conseq.first === "recur")
                                conseq.first = is_recur[0];  // change recur name.
                            if(alter.first === "recur")
                                alter.first = is_recur[0];
                    }
                    o += (compiler(conseq, is_last_exp, is_recur) + " : ");
                    o += (compiler(alter, is_last_exp, is_recur) + ")");
                    return o;
                }
                else{
                    return compiler(list("cond", test, conseq, "else", alter), is_last_exp, is_recur, need_return_string, param_or_assignment);
                }
            } else if (tag === "do") {
                return (need_return_string ? "return " : "") + "(function (){" + lisp_compiler(l.rest, true) + "})()";
            } /*else if (tag === "begin"){   // begin will get return, while do wont
               // return lisp_compiler(l.rest, true, null, is_recur);
            }*/ else if (tag === "apply") {
                var func = compiler(l.rest.first);
                var params = compiler(l.rest.rest.first);
                return (need_return_string ? "return " : "") + func + ".apply(this, " + "(function(){var temp = "+params+"; return temp instanceof $List ? temp.toArray() : temp})()" + ")";
            } else if (tag === "new") {
                var func = compiler(l.rest.first);
                var o = "(new " + func + "";
                o += formatParams(l.rest.rest);
                o += ")";
                return (need_return_string ? "return " : "") + o;
            } else if (tag === "+" || tag === "-" || tag === "*" || tag === "/" || tag === "%" ||
                tag === "==" || tag === "<" || tag === ">" || tag === "!=" || tag === "<=" || tag === ">=" ||
                tag === "&&" || tag === "||" || tag === "&" || tag === "|") {
                var o = "(";
                var params = l.rest;
                if(params.rest == null){ // only one params
                    if(tag === "+" || tag === "*" || tag === "%")
                        return compiler(params.first);
                    else if (tag === "-")
                        return "(-" + compiler(params.first) + ")";
                    else if (tag === "/")
                        return "(1/" + compiler(params.first) + ")";
                    else  // this part might be wrong.
                        return "true";
                }
                while (params != null) {
                    var p = compiler(params.first);
                    o += p;
                    if (params.rest != null)
                        o += (" " + (tag === "==" ? "===" : tag) + " ")
                    params = params.rest;
                }
                return (need_return_string ? "return " : "") + o + ")";
            }
            else if (tag === "instanceof"){
                return (need_return_string ? "return " : "") + "(" + compiler(l.rest.first) + " instanceof " + compiler(l.rest.rest.first) +")";
            }
            /*
             * (defmacro macro-name
             *      var0 pattern0
             *      var1 pattern1 ... )
             */
            else if (tag === "defmacro") {
                var macro_name = compiler(l.rest.first);
                if (typeof(macro_name) != "string") {
                    console.log("ERROR: Invalid macro name: " + macro_name.toString());
                    return "";
                }
                var clauses = l.rest.rest;
                macros[macro_name] = clauses;
                return "";
            } else { // fn
                var func = l.first;
                var params = l.rest;
                func = compiler(func);
                var o = func;
                if(func[func.length - 1] === "}" || (!isNaN(func))) // solve ((fn () "Hi")) bug
                    o = "(" + o + ")";
                if (func in macros) {
                    // console.log("Macro");
                    var expanded_value = macro_expand(macros[func], params);
                    return compiler(expanded_value);
                }

                o += formatParams(params);
                return (need_return_string ? "return " : "") + o;
            }
        } else { // string.
            if (isNaN(l) && l[0] != "'" && l[0] != "\"" && l[0] != ":") // not a number
                return (need_return_string ? "return " : "") + validateName(l);
            else
                return (need_return_string ? "return " : "") + l; // number
        }
    }

    lisp_compiler = function(l, need_return, eval_$, is_recur) {
        var o = "";
        var result;
        var need_return_string = false;
        while (l != null) {
            if (need_return && l.rest == null){
                need_return_string = true; // need add return string.
                //o += "return ";
            }
            if(l.rest === null && (l.first instanceof $List) && (l.first.first === "recur")){
                if(is_recur[0] === false){
                    is_recur[0] = "__lisp__recur__$" + recursion_function_name_count; // last exp;
                    recursion_function_name_count+=3;
                }
                l.first.first = is_recur[0];  // change recur name.
                result = compiler(l.first, true, is_recur, need_return_string);
            }
            else{
                result = compiler(l.first, l.rest === null? true : false, is_recur, need_return_string);
            }
            if(eval_$){    // eval
                if(node_environment)
                    try{
                        eval_result = vm.runInContext(result, global_context, "lisp.vm");
                    }
                    catch(e){
                        console.log(e);
                    }
                else{
                    try{
                        window.eval(result);
                    }
                    catch(e){
                        alert(e);
                    }
                }
            }
            if (!(typeof(result) === "string" && result.trim().length === 0))
                o += (result + "; ");
            l = l.rest;
        }
        return o;
    }

    var compile = function(input_string) {
        var l = lexer(input_string);
        if (l === null) {
            return null;
        }
        var p = parser(l);
        return lisp_compiler(p, false, true);
    }

    var getEvalResult = function(){
        return eval_result;
    }

    return {
        lexer: lexer,
        parser: parser,
        compiler: compiler,
        lisp_compiler: lisp_compiler,
        compile: compile,
        getEvalResult: getEvalResult
    }
}

// test
var lisp = lisp_module();
if (typeof(module) !== "undefined") {
    module.exports.compile = lisp.compile;
    module.exports.getEvalResult = lisp.getEvalResult;
}
