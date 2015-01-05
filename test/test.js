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
var a = 1;
var b = 2;
var c = cons(a, cons(b, null));
car(c);
cdr(c);
var list = list(a, b);
var x = [1, 2, 3];
var x = {
    a: 12,
    [b]: 13,
    "c": 14
};
var x = [1, 2, 3];
x[0] = 12;
var y = {
    a: 12,
    b: 13,
    c: function(a, b) {
        return (a + b);
    }
};
y.a = 13;
y["a"] = 13;
var y = {
    a: 12,
    b: 13,
    c: function(a, b) {
        return (a + b);
    }
};
y.add(y.a, y.b);
(1 === 1);
(1 + 2 + 3);
(1 - 2 - 3);
(1 * 2 * 3);
(1 / 2 / 3);
((1 + 2) * (3 - 4));
(1 > 2 > 3 > 4);
(1 <= 2 <= 3 <= 4);
(true && false);
(1 || 2);
(1 | 0x12);
(1 ? 2 : 3);
var x = (1 ? 2 : 3);
(function() {
    (1 + 2);
    (3 - 4);
    return (5 * 6);
})(); {
    let x = 1;
    let y = 2;
    x = (x + y);
    let z = 4;
    (x + y + z)
}; {
    let a = 1;
    let b = 2;
    (a + b);
    (a - b);
};
var x = (new Array(1, 2, 3, 4));