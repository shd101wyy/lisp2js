/*
 *
 *  Simple Lisp to JavaScript compiler
 *
 */

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
                        output_list.push("[[");
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
                        output_list[j + 1] = "[[";
                    }
                } else {
                    output_list.push("(");
                    output_list.push("[");
                }
                paren_count++;
            } else if (input_string[i] === "{") {
                output_list.push("(");
                output_list.push("{");
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
                o += code;
            }
        }
        if (!isNaN(o[0])) o = "_" + o; // first letter is number, add _ ahead.
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
                if (a.slice(1) === b)
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
        while (clauses != null) {
            var match = macro_match(clauses.first,
                exp, {})
            if (match) { // match
                //console.log(match);
                //console.log(compiler(clauses.rest.first));
                var eval_macro = "(function(){";
                for (key in match) {
                    eval_macro += ("var " + key + " = " + compiler(match[key]) + "; ");
                }
                eval_macro += ("return (" + compiler(clauses.rest.first) + ");");
                eval_macro += "})();";
                return eval(eval_macro);
            }
            clauses = clauses.rest.rest;
        }
        console.log("ERROR: Failed to expand macro\n");
        return "";
    }

    var formatParams = function(params) {
        var o = "";
        if (params != null) { // check first param
            p = compiler(params.first);
            if (typeof(p) === "string" && p[0] === ".") {// fix (x[0].map ) bug.
                o += (p + "(");
            }
            else if (typeof(p) === "string" && p[0] === ":"){
                o += ("(" + p.slice(1) + "=");
            }
            else{
                o += ("(" + p);
                if (params != null) o += ", ";
            }
            params = params.rest;
        } else {
            o += "(";
        }
        while (params != null) {
            var p = params.first;
            p = compiler(p);
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
    compiler = function(l) {
        if (l === null)
            return "null";
        else if (l instanceof $List) {
            var tag = car(l);
            if (tag === "def" || tag === "=" || tag === "set!") {
                var var_name = car(cdr(l));
                var var_value = null;
                if (cdr(cdr(l)) === null)
                    var_value = null;
                else if (tag === "def" && cdr(cdr(cdr(l))) != null)
                    var_value = cons("fn", cons(car(cdr(cdr(l))),
                        cdr(cdr(cdr(l)))));
                else
                    var_value = l.rest.rest.first;

                return (tag === "def" ? "var " : "") + compiler(var_name) + " = " + compiler(var_value) + " ";
            } else if (tag === "[") { // array
                var o = "[";
                l = cdr(l);
                while (l != null) {
                    o += (compiler(car(l)));
                    if (cdr(l) != null)
                        o += ", ";
                    l = cdr(l);
                }
                o += "]";
                return o;
            } else if (tag === "{") {
                var o = "{";
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
            } else if (tag === "[[") { // x[0] =? [[ x 0
                return compiler(l.rest.first) + "[" + compiler(l.rest.rest.first) + "]";
            } else if (tag === "quote" || tag === "quasiquote") {
                if (l.rest.first instanceof $List) {
                    return compiler(tag === "quote" ? quote_list(l.rest.first) : quasiquote_list(l.rest.first));
                } else if (l.rest === null) {
                    return "null";
                } else {
                    if (isNaN(l.rest.first)) // not a number
                        return '"' + l.rest.first + '"';
                    else
                        return l.rest.first;
                }
            } else if (tag === "fn" || tag === "fn*") {
                var o = tag === "fn" ? "function (" : "function* (";
                var params = l.rest.first;
                while (params != null) {
                    var p = params.first;
                    p = compiler(p);
                    if (p[0] === ":") {
                        o += (p.slice(1) + "=");
                    } else if (p === ".") { // ecmascript 6 rest parameters
                        params = params.rest;
                        o += ("..." + params.first);
                    } else {
                        o += p;
                        if (params.rest != null)
                            o += ", ";
                    }
                    params = params.rest;
                }
                o += "){";
                o += lisp_compiler(l.rest.rest, true);
                o += "}";
                return o;
            }
            /*
             * (let x 1 y 2 body)
             * => {let x = 1; let y = 2; ...}
             */
            else if (tag === "let") {
                var vars = {};
                var params = cdr(l);
                var o = "{";
                while (params.rest != null) {
                    var var_name = params.first;
                    var var_val = params.rest.first;

                    if (typeof(var_name === "string")) {
                        if (var_name in vars) {
                            o += (var_name + " = " + compiler(var_val) + "; ");
                        } else {
                            vars[var_name] = true;
                            o += ("let " + var_name + " = " + compiler(var_val) + "; ");
                        }
                    } else {
                        console.log("let implementation not finished yet");
                    }
                    params = params.rest.rest;
                }
                if (params.first instanceof $List && params.first.first === "do") {
                    o += lisp_compiler(params.first.rest, false);
                } else
                    o += compiler(params.first);
                return o + "}";
            }
            /*
             *  (if a b c) => ((a) ? (b) : (c));
             */
            else if (tag === "if") {
                var o = "(";
                var test = l.rest.first;
                var conseq = l.rest.rest.first;
                var alter = l.rest.rest.rest === null ? null : l.rest.rest.rest.first;
                o += (compiler(test) + " ? ");
                o += (compiler(conseq) + " : ");
                o += (compiler(alter) + ")");
                return o;
            } else if (tag === "do") {
                return "(function (){" + lisp_compiler(l.rest, true) + "})()";
            } else if (tag === "apply") {
                var func = compiler(l.rest.first);
                var params = compiler(l.rest.rest.first);
                return func + ".apply(this, " + params + ")";
            } else if (tag === "new") {
                var func = compiler(l.rest.first);
                var o = "(new " + func + "";
                o += formatParams(l.rest.rest);
                o += ")";
                return o;
            } else if (tag === "+" || tag === "-" || tag === "*" || tag === "/" ||
                tag === "==" || tag === "<" || tag === ">" || tag === "!=" || tag === "<=" || tag === ">=" ||
                tag === "&&" || tag === "||" || tag === "&" || tag === "|") {
                var o = "(";
                var params = l.rest;
                while (params != null) {
                    var p = compiler(params.first);
                    o += p;
                    if (params.rest != null)
                        o += (" " + (tag === "==" ? "===" : tag) + " ")
                    params = params.rest;
                }
                return o + ")";
            }
            /*
             * (defmacro macro-name
             *      var0 pattern0
             *      var1 pattern1 ... )
             */
            else if (tag === "defmacro") {
                var macro_name = l.rest.first;
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

                if (func in macros) {
                    // console.log("Macro");
                    var expanded_value = macro_expand(macros[func], params);
                    return compiler(expanded_value);
                }

                o += formatParams(params);
                return o;
            }
        } else { // string.
            if (isNaN(l) && l[0] != "'" && l[0] != "\"" && l[0] != ":") // not a number
                return validateName(l);
            else
                return l; // number
        }
    }

    lisp_compiler = function(l, need_return) {
        var o = "";
        while (l != null) {
            if (need_return && l.rest == null)
                o += "return ";
            var result = compiler(l.first);
            if (result.trim().length != 0)
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
        return lisp_compiler(p);
    }
    return {
        lexer: lexer,
        parser: parser,
        compiler: compiler,
        lisp_compiler: lisp_compiler,
        compile: compile
    }
}

// test
var lisp = lisp_module();
if (typeof(module) !== "undefined") {
    module.exports.compile = lisp.compile;
}
