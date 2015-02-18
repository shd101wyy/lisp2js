var add = function(a, b, __lisp_args__) {
    b = (b === void 0 ? 2 : b);
    var __lisp_args_v__;
    __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
    var x = ((__lisp_args_v__ = __lisp_args__.x) === void 0 ? 3 : __lisp_args_v__);
    var y = ((__lisp_args_v__ = __lisp_args__.y) === void 0 ? 4 : __lisp_args_v__);
    return (a + b + x + y);
};
console.log(add(1));
console.log(add(1, 2));
console.log(add(1, 2, {
    x: 4
}));
var test = function(a, __lisp_args__) {
    for (var b = [], $__0 = 2; $__0 < arguments.length; $__0++) b[$__0 - 2] = arguments[$__0];
    var __lisp_args_v__;
    __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
    var x = ((__lisp_args_v__ = __lisp_args__.x) === void 0 ? 1 : __lisp_args_v__);
    var y = ((__lisp_args_v__ = __lisp_args__.y) === void 0 ? 2 : __lisp_args_v__);
    return (a + b[0] + x + y);
};
console.log(test(1, {
    x: 3
}, 2, 3));