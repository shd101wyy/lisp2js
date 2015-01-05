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
var b = 12;
(1 ? 2 : (3 ? 12 : null));
console.log("Here");