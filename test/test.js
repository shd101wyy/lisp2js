var x = 12;
var y = cons(1, cons(2, cons(3, null)));
var print = function(x) {
    return console.log(x.toString());
};
console.log(x);
console.log(y.toString());
var null63 = function(x) {
    return (x === null);
};
var reverse = function(x) {
    var reverse45helper = function(x, result) {
        return (null63(x) ? result : reverse45helper(cdr(x), cons(car(x), result)));
    };
    return reverse45helper(x, null);
};
print(reverse(cons(1, cons(2, cons(3, null)))));
