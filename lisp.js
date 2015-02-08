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
                if (end === input_string.length || input_string[end] === " " || input_string[end] === "\n" || input_string[end] === "\t" || input_string[end] === "," || input_string[end] === ")" || input_string[end] === "(" || input_string[end] === "]" || input_string[end] === "[" || input_string[end] === "{" || input_string[end] === "}" || input_string[end] === "\'" || input_string[end] === "`" || input_string[end] === "~" || input_string[end] === ";" || input_string[end] === ":" || input_string[end] === ".") break;
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
                        output_list.push("get");
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
                        output_list[j + 1] = "get";
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
                // (get x 0) .abc
                // (get (get x 0) .abc)
                if(t[0] === "." && output_list[output_list.length - 1] === ")"){
                    var p = 1;
                    var j = output_list.length - 1;
                    output_list.push(""); // save space;
                    output_list.push(""); // save space;
                    //output_list.push(""); // save space;
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
                    output_list[j + 1] = "get";
                    output_list.push("\"" + t.slice(1) + "\"");
                    output_list.push(")");
                }

                // a.b
                else if (t[0] === "." && i > 0 && (input_string[i - 1] !== " " && input_string[i - 1] !== "\t" && input_string[i - 1] !== "\n"
                                                   && input_string[i - 1] !== "{" && input_string[i - 1] !=="("
                                                   && input_string[i - 1] !== "}" && input_string[i - 1] !== ")")){
                    var last = output_list[output_list.length - 1];
                    output_list[output_list.length - 1] = "(";
                    output_list.push("get");
                    output_list.push(last);
                    output_list.push("\"" + t.slice(1) + "\"");
                    output_list.push(")");
                }
                // check exp like "abc".length
                else if (t[0] === "."  && input_string[i - 1] === "\""){
                    output_list[output_list.length - 1] += t;
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
                var_name[i] === "." ||
                var_name[i] === "&" ||
                code > 255 // utf
                ) {
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
                return cons(cons("list", formatList(l.first)), formatList(l.rest));
            }
            else{
                if(l.first[0] === "\""){
                    var o = "";
                    for(var i = 0; i < l.first.length; i++){
                        if(l.first[i] === "\""){
                            o += "\\\"";
                        }
                        else if(l.first[i] === "\\"){
                            o += "\\\\";
                        }
                        else if (l.first[i] === "\n"){
                            o += "\\n";
                        }
                        else if (l.first[i] === "\t"){
                            o += "\\t";
                        }
                        else
                        o += l.first[i];
                    }
                    return cons("\"" + o + "\"", formatList(l.rest));
                }
		else if (l.first === null)
		    return cons(l.first, formatList(l.rest));
                else
                    return cons('"' + l.first + '"', formatList(l.rest));
                // return cons(l.first[0] === "\"" ? ("'" + l.first + "'") : '"' + l.first + '"', formatList(l.rest)); // 这里是为了修复 ""abc""这种字符 eval 出问题的bug
            }
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
		    else if (match[key] === null)
			eval_macro += ("var " + key + " = null; ");
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
        while (true) {
            var p = params.first;
            p = compiler(p, null, null, null, true);
            if (typeof(p) === "string" && p[0] === ":") {
                o += "{" + p.slice(1) + ": " + compiler(params.rest.first, null, null, null, true);
                params = params.rest.rest;
                while(true){
                    if(params === null){
                        o += "}";
                        break;
                    }
                    var default_param_name = compiler(params.first, null, null, null, true);
                    if(default_param_name[0] !== ":"){
                        o += "}, " + default_param_name;
                        break;
                    }
                    if(params.rest === null){
                        console.log ("ERROR: Invalid parameter name");
                        return "";
                    }
                    var default_param_val = compiler(params.rest.first, null, null, null, true);
                    o += ", " + default_param_name.slice(1) + ": " + default_param_val;
                    params = params.rest.rest;
                }
                if(params !== null && params.rest !== null)
                    o += ", ";
                // o += (p.slice(1) + "="); // stop supporting add(x = 12) like exp, which is invalid
            } else {
                o += p;
                if (params.rest !== null)
                    o += ", ";
            }
            if(params === null || params.rest === null)
                break;
            params = params.rest;
        }
        o += ")";
        return o;
    }

    /*
     *   eg key is ":a-b-c" ".a-b-c"
     *   then p is "a-b-c"  "a-b-c"
     *
     */
    var formatKey = function(p){
        if(validateName(p) === p && isNaN(p))
            return p;
        else
            return ("\"" + p + "\"");
    }

    compiler = function(l, is_last_exp, is_recur, need_return_string, param_or_assignment, current_fn_name) {
        if (l === null)
            return (need_return_string) ? "return null" : "null";
        else if (l instanceof $List) {
            var tag = car(l);
            if (tag === "def" || tag === "=" || tag === "set!" || tag === "const") {
                var var_name = car(cdr(l));
                var var_value = null;
                if (cdr(cdr(l)) === null)
                    var_value = null;
                else if (/*tag === "def" &&*/ cdr(cdr(cdr(l))) != null)
                    var_value = cons("fn", cons(car(cdr(cdr(l))),
                        cdr(cdr(cdr(l)))));
                else
                    var_value = l.rest.rest.first;

                var_name = compiler(var_name);
                var_value = compiler(var_value, null, null, null, true, var_name); // param_or_assignment
                var o = (tag === "def" ? "var " : (tag === "const" ? "const " : "")) + var_name + " = " + var_value + " ";
                return (need_return_string) ? o + "; return " + var_name : o;
            } else if (tag === "Array") { // array
                var o = need_return_string ? "return [" : "[";
                l = cdr(l);
                while (l != null) {
                    o += (compiler(car(l), null, null, null, true));
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
                    var key = compiler(l.first, null, null, null, true);
                    if (key[0] === ":") {
                        if (l.rest !== null && l.rest.first[0] !== ":"){
                            var k = formatKey(key.slice(1));
                            o += (k + ": ");
                        }
                        else { // {:a :b}  => {a, b}
                            o += (key.slice(1) + (l.rest == null ? "" : ", "));
                            l = l.rest;
                            continue;
                        }
                    } else if (key[0] === "'" || key[0] === "\"")
                        o += (key + ": ");
                    else
                        o += ("[" + key + "]: ")

                    var value = compiler(l.rest.first, null, null, null, true);
                    o += (value);
                    if (l.rest.rest != null)
                        o += ", ";
                    l = l.rest.rest;
                }
                o += "}";
                return o;
            } /*else if (tag === ARRAY_OBJECT_GET) { // x[0] =? [[ x 0
                return (need_return_string ? "return " : "") + compiler(l.rest.first) + "[" + compiler(l.rest.rest.first) + "]";
            }*/ else if (tag === "quote" || tag === "quasiquote") {
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
                    current_fn_name = l.rest.first; // set recur fn name
                    o2 += (l.rest.first + "(");
                    params = l.rest.rest.first;
                    body = l.rest.rest.rest;
                }
                else{
                    o2 += "(";
                    params = l.rest.first;
                    body = l.rest.rest;
                }
                // check default parameters
                /*
                    (def test (x :y 12)
                      (+ x y))

                    (test 3 :y 13)



                    var test = function(x, args){
                        args = (args == null ? {} : args)
                        var y = (args.y == null ? 12 : args.y)
                        return x + y;
                    }

                */
                var __lisp_args__ = null;
                var parameter_num = 0;
                while (params != null) {
                    var p = params.first;
                    p = compiler(p);
                    if (p[0] === ":") { // default parameters
                        __lisp_args__ = {};
                        __lisp_args__[p.slice(1)] = compiler(params.rest.first);
                        params = params.rest.rest;
                        while(true){
                            var default_param_name = compiler(params.first);
                            if(default_param_name === "." ){
                                parameter_num++;
                                o2 += "__lisp_args__, ";
                                var p = compiler(params.rest.first);
                                o2 += ("..." + p);
                                body = cons(list("=", p, list("list.apply", "null", p)), body) // convert from arry to list
                                break;
                            }
                            if(default_param_name === "&"){
                                parameter_num++;
                                o2 += "__lisp_args__, ";
                                o2 += ("..." + compiler(params.rest.first));
                                console.log (o2);
                                break;
                            }
                            if(default_param_name[0] !== ":"){
                                console.log ("ERROR: Invalid default parameter name");
                                return "";
                            }
                            default_param_name = default_param_name.slice(1);
                            if (params.rest === null){
                                console.log ("ERROR: Invalid default parameter name");
                                return "";
                            }
                            var default_param_val = compiler(params.rest.first, null, null, null, true);
                            __lisp_args__[default_param_name] = default_param_val;

                            params = params.rest.rest;
                            if(params === null){
                                o2 += "__lisp_args__";
                                break;
                            }
                        }
                        parameter_num++;
                        break;
                        //o2 += (p.slice(1) + "=");
                    } else if (p === "&") { // ecmascript 6 rest parameters
                        parameter_num++;
                        params = params.rest;
                        o2 += ("..." + compiler(params.first));
                        break;
                    } else if (p === "."){  // es6 rest parameters. convert to list
                        parameter_num++;
                        params = params.rest;
                        var p = compiler(params.first);
                        o2 += ("..." + p);
                        body = cons(list("=", p, list("list.apply", "null", p)), body) // convert from arry to list
                        break;
                    } else {
                        parameter_num++;
                        o2 += p;
                        if (params.rest != null)
                            o2 += ", ";
                    }
                    params = params.rest;
                }
                var is_recur = [current_fn_name ? current_fn_name : false];
                o2 += "){";
                if(__lisp_args__){ // default parameter
                    o2 += "__lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__); ";
                    for(key in __lisp_args__){
                        o2 += "var " + key + " = (__lisp_args__." + key + " == null ? "  + __lisp_args__[key] + " : __lisp_args__." + key + "); ";
                    }
                }
                o2 += lisp_compiler(body, true, null, is_recur);
                o2 += "}";
                if(is_recur[0] !== false && is_recur[0] !== current_fn_name){ // is recur
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
                var o = param_or_assignment ? "((function(){" : "{";
                while (params.rest != null) {
                    var var_name = params.first;
                    var var_val = params.rest.first;

                    if (typeof(var_name === "string")) {
                        if (var_name in vars) {
                            o += (var_name + " = " + compiler(var_val) + "; ");
                        } else {
                            vars[var_name] = true;
                            o += ((/*param_or_assignment ? "var " :*/ "let ") + var_name + " = " + compiler(var_val) + "; ");
                        }
                    } else {
                        console.log("let implementation not finished yet");
                    }
                    params = params.rest.rest;
                }
                                                        // it is param or assignment, or inside function and is last exp
                o += compiler(params.first, null, null, (param_or_assignment ||
                                                        (is_recur && is_last_exp)) ? true : false);
                o += param_or_assignment ? "})())" : "}";
                return ((need_return_string && param_or_assignment) ? "return " : "") + o; //+ "}";
            }
            else if (tag === "cond"){
                var find_else = false;
                var clauses = l.rest;
                var o = "if(";
                if(param_or_assignment)
                    o = "(function(){" + o;
                var test = compiler(clauses.first, null, null, null, true, null);
                o = o + test + "){";
                var body = clauses.rest.first;
                o += compiler(body, true, is_recur, need_return_string || param_or_assignment, null, current_fn_name);
                o += "}"
                clauses = clauses.rest.rest;
                while(clauses != null){
                    o += " else ";
                    if(clauses.first !== "else"){ // else if
                        o += "if ("
                        test = compiler(clauses.first);
                        o = o + test + "){"
                        body = clauses.rest.first;
                        o += compiler(body, true, is_recur, need_return_string || param_or_assignment, null, current_fn_name);
                        o += "}"
                        clauses = clauses.rest.rest;
                    }
                    else{
                        find_else = true;
                        o += "{"
                        body = clauses.rest.first;
                        o += compiler(body, true, is_recur, need_return_string || param_or_assignment, null, current_fn_name);
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
                    o += (compiler(conseq, is_last_exp, is_recur, null, true, null) + " : ");
                    o += (compiler(alter, is_last_exp, is_recur, null, true, null) + ")");
                    return o;
                }
                else{
                    if (alter === null)
                      return compiler(list("cond", test, conseq), is_last_exp, is_recur, need_return_string, param_or_assignment);
                    else
                      return compiler(list("cond", test, conseq, "else", alter), is_last_exp, is_recur, need_return_string, param_or_assignment);
                }
            } else if (tag === "do") {
                if(param_or_assignment){
                    return "(function (){" + lisp_compiler(l.rest, true) + "})()";
                }
                else{
                    return lisp_compiler(l.rest, need_return_string, null, is_recur);
                }
            } /*else if (tag === "begin"){   // begin will get return, while do wont
               // return lisp_compiler(l.rest, true, null, is_recur);
            }*/ else if (tag === "apply") {
                var func = compiler(l.rest.first);
                var params = compiler(l.rest.rest.first, null, null, null, true);
                return (need_return_string ? "return " : "") + "(" + func + ").apply(this, " + "(function(){var temp = "+params+"; return temp instanceof $List ? temp.toArray() : temp})()" + ")";
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
                        return (need_return_string ? "return " : "") + compiler(params.first, null, null, null, true);
                    else if (tag === "-")
                        return (need_return_string ? "return " : "") + "(-" + compiler(params.first, null, null, null, true) + ")";
                    else if (tag === "/")
                        return (need_return_string ? "return " : "") + "(1/" + compiler(params.first, null, null, null, true) + ")";
                    else  // this part might be wrong.
                        return (need_return_string ? "return " : "") + "true";
                }
                while (params != null) {
                    var p = compiler(params.first, null, null, null, true);
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
            else if (tag === "get"){ // (get a "length")  => a["length"]
                var v = compiler(l.rest.first);
                var o = v;
                var args = l.rest.rest;
                while(args != null){
                    var key = compiler(args.first);
                    if(key[0] === "\""){ // if "abc", then use .abc
                        var mid = key.slice(1, -1);
                        if(mid === validateName(mid) && isNaN(mid)){
                            o += ("." + mid);
                        }
                        else
                            o += ("[" + key + "]");
                    }
                    else
                        o += ("[" + key + "]");
                    args = args.rest;
                }
                return (need_return_string ? "return " : "") + o;
            }
            /*
             *  (try (do ...)   catch e (do ...) finally (do ...))
             *
             */
             else if (tag === "try"){
               var o = "try{"
               var clauses = l.rest;
               var body = clauses.first;
               o += compiler(body, true, is_recur, need_return_string || param_or_assignment, null, current_fn_name);
               o += "}"
               clauses = clauses.rest;
               if(clauses != null && clauses.first === "catch"){ // catch
                 o += "catch(";
                 var error = compiler(clauses.rest.first);  // e
                 o += (error + "){");
                 var body = clauses.rest.rest.first;
                 o += compiler(body, true, is_recur, need_return_string || param_or_assignment, null, current_fn_name);
                 o += "}"
                 clauses = clauses.rest.rest.rest;
               }
               if(clauses != null && clauses.first === "finally"){// finally
                 var body = clauses.rest.first;
                 o += "finally {"
                 o += compiler(body, true, is_recur, need_return_string || param_or_assignment, null, current_fn_name);
                 o += "}"
               }
               return o;
             }
            // (in 'a {:a 12}) => true
            else if (tag === "in"){
                return (need_return_string ? "return " : "") + "("+ compiler(l.rest.first) +" in " + compiler(l.rest.rest.first) + ")";
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
                if(func === "recur" && is_last_exp){
                    if(is_recur[0] === false){
                        is_recur[0] = "__lisp__recur__$" + recursion_function_name_count; // last exp;
                        recursion_function_name_count+=3;
                    }
                    func = is_recur[0];
                    l.first = func;
                }
                var o = func;
                if(func[func.length - 1] === "}" || (!isNaN(func))){ // solve ((fn () "Hi")) bug
                    o = "(" + o + ")";
                }
                if (func in macros) {
                    var expanded_value = macro_expand(macros[func], params);
                    return (need_return_string ? "return " : "") + compiler(expanded_value);
                }

                o += formatParams(params);
                return (need_return_string ? "return " : "") + o;
            }
        } else { // string.
            if (isNaN(l) && l[0] !== "'" && l[0] !== "\"" && l[0] !== ":") // not a number
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
            result = compiler(l.first, l.rest === null? true : false, is_recur, need_return_string);
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
