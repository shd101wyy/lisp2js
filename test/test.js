console.log((function __lisp__recur__$0(n, acc) {
    if ((n === 0)) {
        return acc
    } else {
        return __lisp__recur__$0((n - 1), (n * acc))
    };
})(10, 1));