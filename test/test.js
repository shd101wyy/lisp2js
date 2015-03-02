var Test = function(x) {
    this.x = x;
    return this.x;
};
Test.prototype = {
    constructor: Test,
    showX: function() {
        return console.log(this.x);
    }
};
var A = function(x) {
    this.x = x;
    return this.x;
};
A.prototype = {
    constructor: A,
    showX: function() {
        console.log("This is A");
        return console.log(this.x);
    }
};
var B = function(x, y) {
    this.y = 12;
    return this.__proto__.__proto__.constructor.call(this, x);
};
B.prototype = {
    constructor: B,
    __proto__: A.prototype,
    showX: function() {
        console.log("This is B");
        this.__proto__.__proto__.showX.call(this);
        return console.log(("Y: " + this.y));
    }
};
var x = (new B(1, 2));
x.showX();
var y = (function() {
    var X = function(x) {
        this.x = x;
        return this.x;
    };
    X.prototype = {
        constructor: X
    };
    return X;
}());
var Animal = function(age) {
    this.age = age;
    return this.age;
};
Animal.prototype = {
    constructor: Animal,
    showAge: function() {
        console.log("Called from Animal");
        return console.log(this.age);
    }
};
var Dog = function(age) {
    return this.__proto__.__proto__.constructor.call(this, age);
};
Dog.prototype = {
    constructor: Dog,
    __proto__: Animal.prototype,
    showAge: function() {
        console.log("Called from Dog");
        return this.__proto__.__proto__.showAge.call(this);
    },
    bark: function() {
        return console.log("Bark!");
    }
};
var dog = (new Dog(5));
dog.showAge();
dog.bark();