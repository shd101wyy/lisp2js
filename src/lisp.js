var List = function(first, rest) {
    this.first = first;
    this.rest = rest;
    return null;
};
var cons = function(a, b) {
    return (new List(a, b));
};
var car = function(l) {
    return l.first;
};
var cdr = function(l) {
    return l.rest;
};
var list = function(...a) {
    function create_list(a, i) {
        if ((i === a.length)) {
            return null;
        } else {
            return cons(a[i], create_list(a, (i + 1)));
        };
    };
    return create_list(a, 0);
};
List.prototype.length = function() {
    var list_length = function(l, acc) {
        if ((l === null)) {
            return acc;
        } else {
            return list_length(l.rest, (acc + 1));
        };
    };
    return list_length(this, 0);
};
List.prototype.toString = function() {
    function to_string(l, output) {
        if ((l === null)) {
            return (output + ")");
        } else if ((l instanceof List)) {
            return to_string(l.rest, (output + ((l.first === null) ? "()" : l.first.toString()) + ((l.rest === null) ? "" : ",")));
        } else {
            return (output.slice(0, -2) + " . " + l.toString() + ")");
        };
    };
    return to_string(this, "(");
};
List.prototype.reverse = function() {
    function list_reverse(l, output) {
        if ((l instanceof List)) {
            return list_reverse(l.rest, cons(l.first, output));
        } else if ((l === null)) {
            return output;
        } else {
            return cons(l, output);
        };
    };
    return list_reverse(this, null);
};
List.prototype.slice = function(start, end = null) {
    if ((end === null)) {
        if ((start < 0)) {
            start = (this.length() + start);
        };

        function slice1(l, i) {
            if ((i === 0)) {
                return l;
            } else {
                return slice1;
            };
        };
        return slice1(this, start);
    } else {
        var neg = ((start < 0) || (end < 0));
        if (neg) {
            var length = this.length();
            start = ((start < 0) ? (length + start) : start);
            end = ((end < 0) ? (length + end) : end);
        };

        function slice2(l, i, j) {
            if ((i === 0)) {
                if (((j === 0) || (l === null))) {
                    return null;
                } else {
                    return cons(l.first, slice2(l.rest, i, (j - 1)));
                };
            } else {
                return slice2(l.rest, (i - 1), j);
            };
        };
        return slice2(this, start, (end - start));
    };
};
List.prototype.ref = function(i) {
    if ((i < 0)) {
        i = (this.length() + i);
    };

    function ref(l, i) {
        if ((l === null)) {
            return null;
        } else if ((i === 0)) {
            return l.first;
        } else {
            return ref(l.rest, (i - 1));
        };
    };
    return ref(this, i);
};
List.prototype.append = function(...o) {
    o = list.apply(null, o);

    function append(l, o) {
        if ((l === null)) {
            return o;
        } else {
            return cons(l.first, append(l.rest, o));
        };
    };
    return append(this, o);
};
List.prototype.toArray = function() {
    var output = [];

    function to_array(l) {
        if ((l === null)) {
            return output;
        } else {
            output.push(l.first);
            return to_array(l.rest);
        };
    };
    return to_array(this);
};
List.prototype.forEach = function(func) {
    function iter(l) {
        if ((l === null)) {
            return null;
        } else {
            func(l.first);
            return iter(l.rest);
        };
    };
    return iter(this);
};
List.prototype.foreach = List.prototype.forEach;
List.prototype.map = function(func) {
    function iter(l) {
        if ((l === null)) {
            return null;
        } else {
            return cons(func(l.first), iter(l.rest));
        };
    };
    return iter(this);
};
List.prototype.filter = function(func) {
    function iter(l) {
        if ((l === null)) {
            return null;
        } else {
            if (func(l.first)) {
                return cons(l.first, iter(l.rest));
            } else {
                return iter(l.rest);
            };
        };
    };
    return iter(this);
};var obj_foreach = function(obj, func) {
    var keys = Object.keys(obj);
    return (function __lisp__recur__$0(count) {
        if ((count === keys.length)) {
            return null;
        } else {
            func(keys[count], obj[keys[count]]);
            return __lisp__recur__$0((count + 1));
        };
    })(0);
};
var foreach = function(o, func) {
    if ((o.constructor === Object)) {
        return obj_foreach(o, func);
    } else {
        o.forEach(func);
        return null;
    };
};
var map = function(o, func) {
    return o.map(func);
};
var len = function(o) {
    if ((o.constructor === Object)) {
        return Object.keys(o).length;
    } else if ((typeof(o.length) === "function")) {
        return o.length();
    } else {
        return o.length;
    };
};
var append = function(o, ...args) {
    if ((o.constructor === Array)) {
        var x = o.slice();
        x.push.apply(x, args);
        return x;
    } else {
        return o.append.apply(o, args);
    };
};
var append_$33_ = function(o, ...args) {
    if ((o.constructor === Array)) {
        o.push.apply(o, args);
        return o;
    } else {
        return o.append.apply(o, args);
    };
};
var filter = function(o, func) {
    return o.filter(func);
};
var null_$63_ = function(o) {
    return (o === null);
};
var parse_$45_loop = function(args) {
    var parse_$45_loop_$45_helper = function(a, var_$45_names, var_$45_vals) {
        if (null_$63_(a)) {
            return console.log("ERROR: loop invalid statement: ", args, "\n");
        } else if (null_$63_(cdr(a))) {
            return [car(a), var_$45_names, var_$45_vals];
        } else {
            return parse_$45_loop_$45_helper(cdr(cdr(a)), cons(car(a), var_$45_names), cons(car(cdr(a)), var_$45_vals));
        };
    };
    var parse_$45_result = parse_$45_loop_$45_helper(args, null, null);
    var body = parse_$45_result[0];
    var var_$45_names = parse_$45_result[1].reverse();
    var var_$45_vals = parse_$45_result[2].reverse();
    return cons(cons("fn", cons(var_$45_names, cons(body, null))), var_$45_vals);
};
var node_environment = null;
var vm = null;
if ((typeof(module) != "undefined")) {
    vm = function(require, "vm") {
        node_environment = true;
        return node_environment;
    };
};
input_string[i];
var lisp_module = function() {
    var lexer = null;
    var parser = null;
    var compiler = null;
    var lisp_compiler = null;
    var macro = {};
    var GET_DOT = 1;
    var ARRAY_OBJECT_GET = 3;
    var eval_result = "";
    var global_context = null;
    var recursion_function_name_count = 0;
    var append = function(x, y) {
        if ((x === null)) {
            if (((y instanceof List) || (y === null))) {
                return y;
            } else {
                return cons(y, null);
            };
        } else {
            return cons(car(x), append(cdr(x, y)));
        };
    };
    if (node_environment) {
        global_context = vm.createContext({
            cons: cons,
            car: car,
            cdr: cdr,
            list: list,
            List: List,
            append: append,
            console: console
        });
    } else {
        window.append = append;
    };
    var lexer = function(input_string) {
        var output_list = [];
        var paren_count = 0;
        var getIndexOfValidStr = null;
        return (function(i) {
            if ((input_string[i] === "(")) {
                paren_count = (paren_count + 1);
                return output_list.push("(");
            } else if ((input_string[i] === "[")) {
                return null;
            } else return null;
        })(0);
    };
    return null;
};