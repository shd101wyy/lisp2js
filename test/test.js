(12 * 12); {
    let x = 1;
    let y = 2;
    let z = 3;
    (x + y)
};
var add = function(a = 12, b = 20, ...c) {
    return (a + b);
};
add(3, 4, 5, 6);
var x = cons(1, cons(2, cons(3, null)));
var x = 12;
cons(x, cons("x", null));