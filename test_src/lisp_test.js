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
