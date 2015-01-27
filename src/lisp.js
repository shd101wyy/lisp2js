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
          };
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
      };
    };
  };

  ;
  return iter(this);
};
"use strict";

var obj_foreach = function (obj, func) {
  var keys = Object.keys(obj);
  return (function __lisp__recur__$0(count) {
    if (count === keys.length) {
      return null;
    } else {
      func(keys[count], obj[keys[count]]);
      return __lisp__recur__$0(count + 1);
    };
  })(0);
};
var foreach = function (o, func) {
  if (o.constructor === Object) {
    return obj_foreach(o, func);
  } else {
    o.forEach(func);
    return null;
  };
};
var map = function (o, func) {
  return o.map(func);
};
var len = function (o) {
  if (o.constructor === Object) {
    return Object.keys(o).length;
  } else if (typeof o.length === "function") {
    return o.length();
  } else {
    return o.length;
  };
};
var append = function (o) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  if (o.constructor === Array) {
    var x = o.slice();
    x.push.apply(x, args);
    return x;
  } else {
    return o.append.apply(o, args);
  };
};
var append_$33_ = function (o) {
  for (var _len2 = arguments.length, args = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    args[_key2 - 1] = arguments[_key2];
  }

  if (o.constructor === Array) {
    o.push.apply(o, args);
    return o;
  } else {
    return o.append.apply(o, args);
  };
};
var filter = function (o, func) {
  return o.filter(func);
};
var null_$63_ = function (o) {
  return o === null;
};
var parse_$45_loop = function (args) {
  var parse_$45_loop_$45_helper = function (a, var_$45_names, var_$45_vals) {
    if (null_$63_(a)) {
      return console.log("ERROR: loop invalid statement: ", args, "\n");
    } else if (null_$63_(cdr(a))) {
      return [car(a), var_$45_names, var_$45_vals];
    } else {
      return parse_$45_loop_$45_helper(cdr(cdr(a)), cons(car(a), var_$45_names), cons(car(cdr(a)), var_$45_vals));
    };
  };
  var parse_$45_result = parse_$45_loop_$45_helper(args, null, null);
  var body = parse_$45_result[0];
  var var_$45_names = parse_$45_result[1].reverse();
  var var_$45_vals = parse_$45_result[2].reverse();
  return cons(cons("fn", cons(var_$45_names, cons(body, null))), var_$45_vals);
};
var node_environment = null;
var vm = null;
if (typeof module != "undefined") {
  vm = require("vm");
  node_environment = true;
};
var lisp_module = function () {
  var getIndexOfValidStar = function (input_string, end) {
    return (function __lisp__recur__$3(i) {
      if (end === input_string.length || input_string[end] === " " || input_string[end] === "\n" || input_string[end] === "\t" || input_string[end] === "," || input_string[end] === ")" || input_string[end] === "(" || input_string[end] === "]" || input_string[end] === "[" || input_string[end] === "}" || input_string[end] === "{" || input_string[end] === "\"" || input_string[end] === "'" || input_string[end] === "`" || input_string[end] === "~" || input_string[end] === ";" || input_string[end] === ":" || input_string[end] === ".") {
        return end;
      } else {
        return __lisp__recur__$3(end + 1);
      };
    })(end);
  };

  var lexer = function (input_string) {
    return (function __lisp__recur__$6(i, paren_count, output_list) {
      if (i >= input_string.length) {
        if (paren_count === 0) {
          return output_list;
        } else {
          return null;
        };
      } else if (input_string[i] === "(") {
        return __lisp__recur__$6(i + 1, paren_count + 1, append_$33_(output_list, "("));
      } else if (input_string[i] === "[") {
        return null;
      } else if (input_string[i] === "{") {
        return __lisp__recur__$6(i + 1, paren_count + 1, append_$33_(output_list, "(", "Object"));
      } else if (input_string[i] === ")" || input_string[i] === "}" || input_string[i] === "]") {
        return __lisp__recur__$6(i + 1, paren_count - 1, append_$33_(output_list, ")"));
      } else if (input_string[i] === " " || input_string[i] === "\n" || input_string[i] === "\t" || true) {
        return __lisp__recur__$6(i + 1, paren_count, output_list);
      } else if (input_string[i] === "~" && input_string[i + 1] === "@") {
        return __lisp__recur__$6(i + 2, paren_count, append_$33_(output_list, "~@"));
      } else if (input_string[i] === "`" || input_string[i] === "~" || input_string[i] === "'") {
        return __lisp__recur__$6(i + 1, paren_count, append_$33_(output_list, input_string[i]));
      } else if (input_string[i] === ";") {
        return __lisp__recur__$6((function __lisp__recur__$9(j) {
          if (j === input_string.length || input_string[j] === "\n") {
            return j;
          } else {
            return __lisp__recur__$9(j + 1);
          };
        })(i), paren_count, output_list);
      } else if (input_string[i] === "\"") {
        var end = (function __lisp__recur__$12(a) {
          if (a === input_string.length) {
            return a;
          } else if (input_string[a] === "\\") {
            return __lisp__recur__$12(a + 2);
          } else if (input_string[a] === "\"") {
            return a;
          } else {
            return __lisp__recur__$12(a + 1);
          };
        })(i + 1);
        return __lisp__recur__$6(end + 1, paren_count, append_$33_(input_string.slice(i, end + 1)));
      } else {
        return null;
      };
    })(0, 0, []);
  };

  var lexer = null;
  var parser = null;
  var compiler = null;
  var lisp_compiler = null;
  var macro = {};
  var GET_DOT = 1;
  var ARRAY_OBJECT_GET = 3;
  var eval_result = "";
  var global_context = null;
  var recursion_function_name_count = 0;
  var append = function (x, y) {
    if (x === null) {
      if (y instanceof List || y === null) {
        return y;
      } else {
        return cons(y, null);
      };
    } else {
      return cons(car(x), append(cdr(x, y)));
    };
  };
  if (node_environment) {
    global_context = vm.createContext({
      cons: cons,
      car: car,
      cdr: cdr,
      list: list,
      List: List,
      append: append,
      console: console
    });
  } else {
    window.append = append;
  };

  ;

  ;
  return null;
};