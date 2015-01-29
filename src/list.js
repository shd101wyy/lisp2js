"use strict";

var List = function (first, rest) {
  this.first = first;
  this.rest = rest;
  return null;
};
var cons = function (a, b) {
  return new List(a, b);
};
var car = function (l) {
  return l.first;
};
var cdr = function (l) {
  return l.rest;
};
var list = function () {
  var create_list = function (a, i) {
    if (i === a.length) {
      return null;
    } else {
      return cons(a[i], create_list(a, i + 1));
    };
  };

  for (var _len = arguments.length, a = Array(_len), _key = 0; _key < _len; _key++) {
    a[_key] = arguments[_key];
  }

  ;
  return create_list(a, 0);
};
List.prototype.length = function () {
  var list_length = function (l, acc) {
    if (l === null) {
      return acc;
    } else {
      return list_length(l.rest, acc + 1);
    };
  };
  return list_length(this, 0);
};
List.prototype.toString = function () {
  var to_string = function (l, output) {
    if (l === null) {
      return output + ")";
    } else if (l instanceof List) {
      return to_string(l.rest, output + (l.first === null ? "()" : l.first.toString()) + (l.rest === null ? "" : ","));
    } else {
      return output.slice(0, -2) + " . " + l.toString() + ")";
    };
  };

  ;
  return to_string(this, "(");
};
List.prototype.reverse = function () {
  var list_reverse = function (l, output) {
    if (l instanceof List) {
      return list_reverse(l.rest, cons(l.first, output));
    } else if (l === null) {
      return output;
    } else {
      return cons(l, output);
    };
  };

  ;
  return list_reverse(this, null);
};
List.prototype.slice = function (start) {
  var _this = this;
  var end = arguments[1] === undefined ? null : arguments[1];
  if (end === null) {
    var _ret = (function () {
      var slice1 = function (l, i) {
        if (i === 0) {
          return l;
        } else {
          return slice1;
        };
      };

      if (start < 0) {
        start = _this.length() + start;
      };

      ;
      return {
        v: slice1(_this, start)
      };
    })();

    if (typeof _ret === "object") return _ret.v;
  } else {
    var neg;
    var length;
    var _ret2 = (function () {
      var slice2 = function (l, i, j) {
        if (i === 0) {
          if (j === 0 || l === null) {
            return null;
          } else {
            return cons(l.first, slice2(l.rest, i, j - 1));
          }
        } else {
          return slice2(l.rest, i - 1, j);
        };
      };

      neg = start < 0 || end < 0;
      if (neg) {
        length = _this.length();
        start = start < 0 ? length + start : start;
        end = end < 0 ? length + end : end;
      };

      ;
      return {
        v: slice2(_this, start, end - start)
      };
    })();

    if (typeof _ret2 === "object") return _ret2.v;
  };
};
List.prototype.ref = function (i) {
  var ref = function (l, i) {
    if (l === null) {
      return null;
    } else if (i === 0) {
      return l.first;
    } else {
      return ref(l.rest, i - 1);
    };
  };

  if (i < 0) {
    i = this.length() + i;
  };

  ;
  return ref(this, i);
};
List.prototype.append = function () {
  var append = function (l, o) {
    if (l === null) {
      return o;
    } else {
      return cons(l.first, append(l.rest, o));
    };
  };

  for (var _len2 = arguments.length, o = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    o[_key2] = arguments[_key2];
  }

  o = list.apply(null, o);

  ;
  return append(this, o);
};
List.prototype.toArray = function () {
  var to_array = function (l) {
    if (l === null) {
      return output;
    } else {
      output.push(l.first);
      return to_array(l.rest);
    };
  };

  var output = [];

  ;
  return to_array(this);
};
List.prototype.forEach = function (func) {
  var iter = function (l) {
    if (l === null) {
      return null;
    } else {
      func(l.first);
      return iter(l.rest);
    };
  };

  ;
  return iter(this);
};
List.prototype.foreach = List.prototype.forEach;
List.prototype.map = function (func) {
  var iter = function (l) {
    if (l === null) {
      return null;
    } else {
      return cons(func(l.first), iter(l.rest));
    };
  };

  ;
  return iter(this);
};
List.prototype.filter = function (func) {
  var iter = function (l) {
    if (l === null) {
      return null;
    } else {
      if (func(l.first)) {
        return cons(l.first, iter(l.rest));
      } else {
        return iter(l.rest);
      }
    };
  };

  ;
  return iter(this);
};
