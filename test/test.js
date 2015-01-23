var test = function(...x) {
    x = list.apply(this, x);
    return x;
};
var test = function(...x) {
    return x;
};
var add = function(a, ...b) {
    b = list.apply(this, b);
    return (a + car(b));
};