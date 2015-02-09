var add = function(a) {
    for (var b = [], $__0 = 1; $__0 < arguments.length; $__0++) b[$__0 - 1] = arguments[$__0];
    return (a + b[0]);
};
var add = function(a) {
    for (var b = [], $__0 = 1; $__0 < arguments.length; $__0++) b[$__0 - 1] = arguments[$__0];
    b = list.apply(null, b);
    return (a + car(b));
};

function(a, __lisp_args__) {
    var __lisp_args_v__;
    __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
    var b = ((__lisp_args_v__ = __lisp_args__.b) === void 0 ? 13 : __lisp_args_v__);
    for (var c = [], $__0 = 2; $__0 < arguments.length; $__0++) c[$__0 - 2] = arguments[$__0];
    return (a + b + c[0]);
};