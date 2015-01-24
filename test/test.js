var parse_$45_loop = function(args) {
    var parse_$45_loop_$45_helper = function(a, var_$45_names, var_$45_vals) {
        var null_$63_ = function(o) {
            return (o === null);
        };
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
var print = console.log;
console.log("Enter Here");
(function __lisp__recur__$0(x, acc) {
    if ((x === 0)) {
        return acc;
    } else {
        console.log(x);
        return __lisp__recur__$0((x - 1), (x * acc));
    };
})(10, 1);
console.log("Done");