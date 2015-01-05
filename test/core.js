var lisp2js = {
    author: "Yiyi-Wang",
    "core-version": "0.0.1"
};
var print = function(x) {
    return console.log(x.toString());
};
var null63 = function(x) {
    return (x === null);
};
var not = function(a) {
    return (a ? null : 1);
};
var _$4242_ = Math.pow;
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
    var _$4562list45iter_ = function(v, i) {
        return ((i === length) ? null : cons(v[i], _$4562list45iter_(v, (i + 1))));
    };
    return _$4562list45iter_(this, 0);
};
var x = [1, 2, 3, 4, 5, 6];
print(x.toList());