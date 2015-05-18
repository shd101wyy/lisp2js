var List = function(first, rest) {
    this.first = first;
    this.rest = rest;
    return this.rest;
};
List.prototype = {
    constructor: List,
    length: function() {
        function list_length(l, acc) {
            if ((l === null)) {
                return acc
            } else {
                return list_length(l.rest, (acc + 1))
            };
        };
        return list_length(this, 0);
    },
    toString: function() {
        function to_string(l, output) {
            if ((l === null)) {
                return (output + ")")
            } else if ((l instanceof List)) {
                return to_string(l.rest, (output + ((l.first === null) ? "()" : l.first.toString()) + ((l.rest === null) ? "" : ",")))
            } else {
                return (output.slice(0, -2) + " . " + l.toString() + ")")
            };
        };
        return to_string(this, "(");
    },
    reverse: function() {
        function list_reverse(l, output) {
            if ((l instanceof List)) {
                return list_reverse(l.rest, cons(l.first, output))
            } else if ((l === null)) {
                return output
            } else {
                return cons(l, output)
            };
        };
        return list_reverse(this, null);
    },
    slice: function(start, end) {
        end = (end === void 0 ? null : end);
        if ((end === null)) {
            if ((start < 0)) {
                start = (this.length() + start)
            };

            function slice1(l, i) {
                if ((i === 0)) {
                    return l
                } else {
                    return slice1
                };
            };
            return slice1(this, start);
        } else {
            var neg = ((start < 0) || (end < 0));
            if (neg) {
                var length = this.length();
                start = ((start < 0) ? (length + start) : start);
                end = ((end < 0) ? (length + end) : end);
            };

            function slice2(l, i, j) {
                if ((i === 0)) {
                    if (((j === 0) || (l === null))) {
                        return null
                    } else {
                        return cons(l.first, slice2(l.rest, i, (j - 1)))
                    }
                } else {
                    return slice2(l.rest, (i - 1), j)
                };
            };
            return slice2(this, start, (end - start));
        };
    },
    ref: function(i) {
        function ref(l, i) {
            if ((l === null)) {
                return null
            } else if ((i === 0)) {
                return l.first
            } else {
                return ref(l.rest, (i - 1))
            };
        };
        return ref(this, ((i < 0) ? (this.length() + i) : i));
    },
    toArray: function() {
        var output = [];

        function to_array(l) {
            if ((l === null)) {
                return output
            } else {
                output.push(l.first);
                return to_array(l.rest);
            };
        };
        return to_array(this);
    },
    forEach: function(func) {
        function iter(l) {
            if ((l === null)) {
                return null
            } else {
                func(l.first);
                return iter(l.rest);
            };
        };
        return iter(this);
    },
    map: function(func) {
        function iter(l) {
            if ((l === null)) {
                return null
            } else {
                return cons(func(l.first), iter(l.rest))
            };
        };
        return iter(this);
    },
    filter: function(func) {
        function iter(l) {
            if ((l === null)) {
                return null
            } else {
                if (func(l.first)) {
                    return cons(l.first, iter(l.rest))
                } else {
                    return iter(l.rest)
                }
            };
        };
        return iter(this);
    }
};

function cons(a, b) {
    return (new List(a, b));
};

function car(l) {
    return l.first;
};

function cdr(l) {
    return l.rest;
};

function list() {
    for (var a = [], $__0 = 0; $__0 < arguments.length; $__0++) a[$__0 - 0] = arguments[$__0];

    function create_list(a, i) {
        if ((i === a.length)) {
            return null
        } else {
            return cons(a[i], create_list(a, (i + 1)))
        };
    };
    return create_list(a, 0);
};
if ((!(typeof(module) === "undefined"))) {
    module.exports.List = List;
    module.exports.list = list;
    module.exports.cons = cons;
    module.exports.car = car;
    module.exports.cdr = cdr;
};