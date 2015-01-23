var List = function(first, rest) {
    this.first = first;
    this.rest = rest;
    return null;
};
var cons = function(a, b) {
    return (new List(a, b));
};
var car = function(l) {
    return l.first;
};
var cdr = function(l) {
    return l.rest;
};
var list = function(...a) {
    function create_list(a, i) {
        if ((i === a.length)) {
            return null;
        } else {
            return cons(a[i], create_list(a, (i + 1)));
        };
    };
    return create_list(a, 0);
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
            return (output.slice(0, -2) + " . " + l.toString() + ")");
        };
    };
    return to_string(this, "(");
};
List.prototype.reverse = function() {
    function list_reverse(l, output) {
        if ((l instanceof List)) {
            return list_reverse(l.rest, cons(l.first, output));
        } else if ((l === null)) {
            return output;
        } else {
            return cons(l, output);
        };
    };
    return list_reverse(this, null);
};
List.prototype.slice = function(start, end = null) {
    if ((end === null)) {
        if ((start < 0)) {
            start = (this.length() + start);
        };

        function slice1(l, i) {
            if ((i === 0)) {
                return l;
            } else {
                return slice1;
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
                    return null;
                } else {
                    return cons(l.first, slice2(l.rest, i, (j - 1)));
                };
            } else {
                return slice2(l.rest, (i - 1), j);
            };
        };
        return slice2(this, start, (end - start));
    };
};
List.prototype.ref = function(i) {
    if ((i < 0)) {
        i = (this.length() + i);
    };

    function ref(l, i) {
        if ((l === null)) {
            return null;
        } else if ((i === 0)) {
            return l.first;
        } else {
            return ref(l.rest, (i - 1));
        };
    };
    return ref(this, i);
};
List.prototype.append = function(...o) {
    o = list.apply(this, o);

    function append(l, o) {
        if ((l === null)) {
            return o;
        } else {
            return cons(l.first, append(l.rest, o));
        };
    };
    return append(this, o);
};
List.prototype.toArray = function() {
    var output = [];

    function to_array(l) {
        if ((l === null)) {
            return output;
        } else {
            output.push(l.first);
            return to_array(l.rest);
        };
    };
    return to_array(this);
};
List.prototype.forEach = function(func) {
    function iter(l) {
        if ((l === null)) {
            return null;
        } else {
            func(l.first);
            return iter(l.rest);
        };
    };
    return iter(this);
};
List.prototype.foreach = List.prototype.forEach;
List.prototype.map = function(func) {
    function iter(l) {
        if ((l === null)) {
            return null;
        } else {
            return cons(func(l.first), iter(l.rest));
        };
    };
    return iter(this);
};
List.prototype.filter = function(func) {
    function iter(l) {
        if ((l === null)) {
            return null;
        } else {
            if (func(l.first)) {
                return cons(l.first, iter(l.rest));
            } else {
                return iter(l.rest);
            };
        };
    };
    return iter(this);
};
var obj_foreach = function(obj, func) {
    var keys = Object.keys(obj);
    return (function __lisp__recur__$0(count) {
        if ((count === keys.length)) {
            return null;
        } else {
            func(keys[count], obj[keys[count]]);
            return __lisp__recur__$0((count + 1));
        };
    })(0);
};
var foreach = function(o, func) {
    if ((o.constructor === Object)) {
        return obj_foreach(o, func);
    } else {
        o.forEach(func);
        return null;
    };
};