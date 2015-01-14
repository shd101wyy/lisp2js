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
console.log("Hi There");