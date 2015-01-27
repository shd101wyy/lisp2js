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
  body = body instanceof List && car(body) === "do" ? cdr(body) : body;
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
    return;
  };

  var lexer = function (input_string) {
    return;
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
