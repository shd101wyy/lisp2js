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