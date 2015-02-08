var add = function(__lisp_args__) {
    var __lisp_args_v__;
    __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
    var a = ((__lisp_args_v__ = __lisp_args__.a) === void 0 ? 12 : __lisp_args_v__);
    var b = ((__lisp_args_v__ = __lisp_args__.b) === void 0 ? 3 : __lisp_args_v__);
    return (a + b);
};

function(a, __lisp_args__, ...c) {
    var __lisp_args_v__;
    __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
    var b = ((__lisp_args_v__ = __lisp_args__.b) === void 0 ? 13 : __lisp_args_v__);
    return (a + b + c[0]);
};
var add = function(__lisp_args__) {
    var __lisp_args_v__;
    __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
    var a = ((__lisp_args_v__ = __lisp_args__.a) === void 0 ? 1 : __lisp_args_v__);
    var b = ((__lisp_args_v__ = __lisp_args__.b) === void 0 ? 2 : __lisp_args_v__);
    return (a + b);
};
add();
add({
    a: 3,
    b: 4
});
add({
    b: 3
});