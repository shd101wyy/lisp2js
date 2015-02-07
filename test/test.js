function add(i) {
    if ((i === 0)) {
        return 0
    } else {
        return add((i - 1))
    };
};

function __lisp__recur__$0(x, y) {
    if ((x === 0)) {
        return y
    } else {
        var z = 12;
        return __lisp__recur__$0((x - 1), (y + 1));
    };
};
var test = function(n) {
    if ((n === 0)) {
        return 0
    } else if (1) {
        return test((n - 2))
    } else {
        return test((n - 1))
    };
};
(function __lisp__recur__$3(n, acc) {
    if ((n === 0)) {
        return acc
    } else {
        return __lisp__recur__$3((n - 1), (n * acc))
    };
})(10, 1); {
    let x = 1;
    let y = 2;
    (x + y)
};

function test() {
    {
        let x = 1;
        let y = 2;
        x = (x + y);
        (x + y)
    };
    return (x + y);
};
(((function() {
    var x = 1;
    var y = 2;
    return (x + y)
})()) + 3);