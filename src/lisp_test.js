var obj_foreach = function(obj, func) {
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
(function __lisp__recur__$3(i) {
    if ((i === 0)) {
        return console.log("Done");
    } else {
        console.log(i);
        return __lisp__recur__$3((i - 1));
    };
})(10);