var test = function(__lisp_args__) {
    var __lisp_args_v__;
    __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
    var x = ((__lisp_args_v__ = __lisp_args__.x) === void 0 ? 12 : __lisp_args_v__);
    var y = ((__lisp_args_v__ = __lisp_args__.y) === void 0 ? 13 : __lisp_args_v__);
    return (x + y);
};
test();
$.post("test.php").done(function() {
    return "done";
}).fail(function() {
    return "fail";
}).test(function() {
    return "test";
});
test({
    a: 12,
    b: 13
}, x, y);