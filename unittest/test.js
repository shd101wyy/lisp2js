var x = 12;
var x = 12;
var _$45__$62_this_$42_name$invalid_$64_in_$42_js = 13;
var _$42__$42_ = Math.pow;
x = 15;

function add(a, b) {
    return (a + b);
};
add(3, 4);

function add(a, b) {
    a = (a === void 0 ? 12 : a);
    b = (b === void 0 ? 3 : b);
    return (a + b);
};

function add(x, __lisp_args__) {
    var __lisp_args_v__;
    __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
    var y = ((__lisp_args_v__ = __lisp_args__.y) === void 0 ? 1 : __lisp_args_v__);
    var z = ((__lisp_args_v__ = __lisp_args__.z) === void 0 ? 2 : __lisp_args_v__);
    return (x + y + z);
};
add(0);
add(1, {
    y: 3
});

function add(a) {
    for (var b = [], $__0 = 1; $__0 < arguments.length; $__0++) b[$__0 - 1] = arguments[$__0];
    return (a + b[0]);
};

function add(a) {
    for (var b = [], $__0 = 1; $__0 < arguments.length; $__0++) b[$__0 - 1] = arguments[$__0];
    b = list.apply(null, b);
    return (a + car(b));
};

function(a, b) {
    for (var c = [], $__0 = 2; $__0 < arguments.length; $__0++) c[$__0 - 2] = arguments[$__0];
    b = (b === void 0 ? 13 : b);
    return (a + b + c[0]);
};