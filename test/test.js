var test = function() {
    return cons("+", cons(1, cons(3, null)));
};
console.log((1 + 3));
var add = function(x = 12, y = 15) {
    return (x + y);
};
add[a].add[0].test(a.b[3], 12);
var MyObject = function(age) {
    return this.age = age;
};
var o = (new MyObject(12));
console.log(o.age);
console.log(o);
var add = function(x, y) {
    return (x + y);
};
add.apply(this, (function() {
    var temp = [1, 2];
    return temp instanceof $List ? temp.toArray() : temp
})());
((function() {
    var x = 1;
    var y = 2;
    x = (x + y);
    var z = 4;
    return (x + y + z)
})());
((function() {
    var a = 1;
    var b = 2;
    (a + b);
    return (a - b);
})());