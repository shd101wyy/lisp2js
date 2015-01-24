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
console.log((function __lisp__recur__$3(x, acc) {
    if ((x === 0)) {
        return acc;
    } else {
        return __lisp__recur__$3((x - 1), (x * acc));
    };
})(10, 1));