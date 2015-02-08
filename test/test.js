var test = function(__lisp_args__) {
    var __lisp_args_v__;
    __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
    var a = ((__lisp_args_v__ = __lisp_args__.a) === void 0 ? 12 : __lisp_args_v__);
    var b = ((__lisp_args_v__ = __lisp_args__.b) === void 0 ? 13 : __lisp_args_v__);
    return (a + b);
};
console.log(test());
console.log(test({
    b: 14
}));