var List = function(first, rest) {
    this.first = first;
    this.rest = rest;
    return null;
};
List.prototype.length = function() {
    var list_length = function(l, acc) {
        if ((l === null)) {
            return acc;
        } else {
            return list_length(l.rest, (acc + 1));
        };
    };
    return list_length(this, 0);
};
List.prototype.toString = function() {
    function to_string(l, output) {
        if ((l === null)) {
            return (output + ")");
        } else if ((l instanceof List)) {
            return to_string(l.rest, (output + ((l.first === null) ? "()" : l.first.toString()) + ((l.rest === null) ? "" : ",")));
        } else {
            return (output.slice(0, -2) + " . " + l.toString(null) + ")");
        };
    };
    return to_string(this, "(");
};
var test = function __lisp__recur__$0(n) {
    if ((n === 0)) {
        return 0;
    } else if (1) {
        return __lisp__recur__$0((n - 2));
    } else {
        return __lisp__recur__$0((n - 1));
    };
};