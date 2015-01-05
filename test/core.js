var lisp2js = {
    author: "Yiyi-Wang",
    "core-version": "0.0.1"
};
var List = $List;
var print = function(x) {
    return console.log(x.toString());
};
var null_$63_ = function(x) {
    return (x === null);
};
var not = function(a) {
    return (a ? null : 1);
};
var append = function(x, y) {
    return ((x === null) ? y : cons(car(x), append(cdr(x), y)));
};
var _$42__$42_ = Math.pow;
var caar = function(x) {
    return car(car(x));
};
var cadr = function(x) {
    return car(cdr(x));
};
var cddr = function(x) {
    return cdr(cdr(x));
};
var caddr = function(x) {
    return car(cdr(cdr(x)));
};
var cdddr = function(x) {
    return cdr(cdr(cdr(x)));
};
var cadddr = function(x) {
    return car(cdr(cdr(cdr(x))));
};
Array.prototype.toList = function() {
    var length = this.length;
    var _$45__$62_list_$45_iter = function(v, i) {
        return ((i === length) ? null : cons(v[i], _$45__$62_list_$45_iter(v, (i + 1))));
    };
    return _$45__$62_list_$45_iter(this, 0);
};
var foreach = function(value, func) {
    return value.forEach(func);
};
var list_$45_map1 = function(f, p) {
    return (null_$63_(p) ? null : cons(f(car(p)), list_$45_map1(f, cdr(p))));
};
var list_$45_map = null;
list_$45_map = function(f, p0, ...p) {
    p = p.toList();
    return ((p0 === null) ? null : cons(f.apply(this, (function() {
        var temp = list_$45_map1(car, cons(p0, p));
        return temp instanceof $List ? temp.toArray() : temp
    })()), list_$45_map.apply(this, (function() {
        var temp = cons(f, list_$45_map1(cdr, cons(p0, p)));
        return temp instanceof $List ? temp.toArray() : temp
    })())));
};
var list_$45_zip = function(...args) {
    args = args.toList();
    return list_$45_map.apply(this, (function() {
        var temp = cons(list, args);
        return temp instanceof $List ? temp.toArray() : temp
    })());
};
var vector_$45_push_$33_ = function(x, a) {
    x.push(a);
    return x;
};
var vector_$45_map1 = function(f, p, count, result) {
    return ((count === p.length) ? result : vector_$45_map1(f, p, (count + 1), vector_$45_push_$33_(result, f(p[count]))));
};
var vector_$45_get_$45_nth_$45_arguments = function(n, args) {
    return ((args === null) ? null : cons(car(args)[n], vector_$45_get_$45_nth_$45_arguments(n, cdr(args))));
};
var vector_$45_map_$45_helper = null;
vector_$45_map_$45_helper = function(f, count, result, length_$45_of_$45_1st_$45_vector, p) {
    return ((count === length_$45_of_$45_1st_$45_vector) ? result : (function() {
        vector_$45_push_$33_(result, f.apply(this, (function() {
            var temp = vector_$45_get_$45_nth_$45_arguments(count, p);
            return temp instanceof $List ? temp.toArray() : temp
        })()));
        return vector_$45_map_$45_helper(f, (count + 1), result, length_$45_of_$45_1st_$45_vector, p);
    })());
};
var vector_$45_map = function(f, p, ...args) {
    args = args.toList();
    return vector_$45_map_$45_helper(f, 0, [], p.length, cons(p, args));
};
var vector_$45_zip = function(...args) {
    args = args.toList();
    return vector_$45_map.apply(this, (function() {
        var temp = cons(Array, args);
        return temp instanceof $List ? temp.toArray() : temp
    })());
};
var list_$45_reduce = function(f, l, param_num = 2) {
    var get_num_element_list = function(l, num) {
        return ((num === 0) ? null : (null_$63_(l) ? print("ERROR: reduce function invalid parameters list") : cons(car(l), get_num_element_list(cdr(l), (num - 1)))));
    };
    var cdrn = function(l, num) {
        return ((num === 0) ? l : cdrn(cdr(l), (num - 1)));
    };
    var reduce_iter = function(f, l, param_num_1, acc) {
        return ((l === null) ? acc : reduce_iter(f, cdrn(l, param_num_1), param_num_1, f.apply(this, (function() {
            var temp = cons(acc, get_num_element_list(l, param_num_1));
            return temp instanceof $List ? temp.toArray() : temp
        })())));
    };
    return ((l === null) ? null : reduce_iter(f, cdr(l), (param_num - 1), car(l)));
};
var curry = function(func, ...arg) {
    arg = arg.toList();
    return function(...another_$45_arg) {
        another_$45_arg = another_$45_arg.toList();
        return func.apply(this, (function() {
            var temp = append(arg, another_$45_arg);
            return temp instanceof $List ? temp.toArray() : temp
        })());
    };
};
console.log(curry(function(a, b) {
    return (a + b);
}, 3)(4));