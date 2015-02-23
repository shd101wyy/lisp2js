var add_$45_rat = function(x, y) {
    return make_$45_rat(((numer(x) * denom(y)) + (numer(y) * denom(x))), (denom(x) * denom(y)));
};
var sub_$45_rat = function(x, y) {
    return make_$45_rat(((numer(x) * denom(y)) - (numer(y) * denom(x))), (denom(x) * denom(y)));
};
var mul_$45_rat = function(x, y) {
    return make_$45_rat((numer(x) * numer(y)), (denom(x) * denom(y)));
};
var div_$45_rat = function(x, y) {
    return make_$45_rat((numer(x) * denom(y)), (denom(x) * numer(y)));
};
var equal_$45_rat_$63_ = function(x, y) {
    return ((numer(x) * denom(y)) === (numer(y) * denom(x)));
};
var gcd = function(a, b) {
    if ((b === 0)) {
        return a
    } else {
        return gcd(b, (a % b))
    };
};
var Ratio = function(n, d) {
    this.n = n;
    this.d = d;
    return this.d;
};
Ratio.prototype.toString = function() {
    if ((this.d === 1)) {
        return this.n
    } else {
        return (this.n + "/" + this.d)
    };
};
var make_$45_rat = function(n, d) {
    return ((function() {
        var g = gcd(n, d);
        return (new Ratio((n / g), (d / g)))
    })());
};
var numer = function(x) {
    return x.n;
};
var denom = function(x) {
    return x.d;
};
var print_rat = function(x) {
    return console.log(x.toString());
};
var print_r = function(x) {
    if ((x.constructor === Ratio)) {
        return print_rat(x)
    } else {
        return console.log(x)
    };
};
var integer_$63_ = function(x) {
    return Number.isInteger;
};
var float_$63_ = function(x) {
    return ((typeof(x) === "number") && (!integer_$63_(x)));
};
var ratio_$63_ = function(x) {
    return (x.constructor === Ratio);
};
var r_$43_ = function(x, y) {
    if ((ratio_$63_(x) && ratio_$63_(y))) {
        return add_$45_rat(x, y)
    } else {
        return (x + y)
    };
};
var r_$45_ = function(x, y) {
    if ((ratio_$63_(x) && ratio_$63_(y))) {
        return sub_$45_rat(x, y)
    } else {
        return (x - y)
    };
};
var r_$42_ = function(x, y) {
    if ((ratio_$63_(x) && ratio_$63_(y))) {
        return mul_$45_rat(x, y)
    } else {
        return (x * y)
    };
};
var r_$47_ = function(x, y) {
    if ((ratio_$63_(x) && ratio_$63_(y))) {
        return div_$45_rat(x, y)
    } else if ((integer_$63_(x) && integer_$63_(y))) {
        return make_$45_rat(x, y)
    } else {
        return (x / y)
    };
};
var demo = function() {
    print_rat(add_$45_rat(make_$45_rat(4, 3), make_$45_rat(5, 3)));
    print_rat(mul_$45_rat(make_$45_rat(4, 3), make_$45_rat(12, 18)));
    print_r(r_$47_(3, 4));
    print_r(r_$43_(r_$47_(3, 4), r_$47_(6, 5)));
    print_r(r_$43_(3, 4));
    print_r(r_$43_(r_$47_(1, 2), r_$47_(1, 4)));
    return print_r(r_$47_(12, 16));
};