"use strict";

var _$35_t = true;
var _$35_f = false;
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
  var append = function (x, y) {
    if (x === null) {
      if (y instanceof List || y === null) {
        return y;
      } else {
        return cons(y, null);
      }
    } else {
      return cons(car(x), append(cdr(x, y)));
    };
  };

  var getIndexOfValidStar = function (input_string, end) {
    return (function __lisp__recur__$3(end) {
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
        }
      } else if (input_string[i] === "(") {
        return __lisp__recur__$6(i + 1, paren_count + 1, append_$33_(output_list, "("));
      } else if (input_string[i] === "[") {
        if (i != 0 && input_string[i - 1] != " " && input_string[i - 1] != "\n" && input_string[i - 1] != "\t" && input_string[i - 1] != "'" && input_string[i - 1] != "`" && input_string[i - 1] != "~" && input_string[i - 1] != "(" && input_string[i - 1] != "{" && input_string[i - 1] != "[") {
          var j = output_list.length - 1;
          var p = output_list[j] === ")" ? 1 : 0;
          if (p === 0) {
            return __lisp__recur__$6(i + 1, paren_count + 1, (function () {
              append_$33_(output_list, "get", output_list[j]);
              output_list[j] = "(";
              return output_list;
            })());
          } else {
            return __lisp__recur__$6(i + 1, paren_count + 1, (function () {
              append_$33_(output_list, "", "");
              output_list[j + 2] = output_list[j];
              return (function __lisp__recur__$9(j, p, output_list) {
                output_list[j + 2] = output_list[j];
                if (output_list[j] === ")") {
                  return __lisp__recur__$9(j - 1, p + 1, output_list);
                } else if (output_list[j] === "(") {
                  if (p - 1 === 0) {
                    output_list[j] = "(";
                    output_list[j + 1] = "get";
                    return output_list;
                  } else {
                    return __lisp__recur__$9(j - 1, p - 1, output_list);
                  }
                } else {
                  return __lisp__recur__$9(j - 1, p, output_list);
                };;
              })(j - 1, p, output_list);
            })());
          };
        } else {
          return __lisp__recur__$6(i + 1, paren_count + 1, append_$33_(output_list, "(", "Array"));
        }
      } else if (input_string[i] === "{") {
        return __lisp__recur__$6(i + 1, paren_count + 1, append_$33_(output_list, "(", "Object"));
      } else if (input_string[i] === ")" || input_string[i] === "}" || input_string[i] === "]") {
        return __lisp__recur__$6(i + 1, paren_count - 1, append_$33_(output_list, ")"));
      } else if (input_string[i] === " " || input_string[i] === "\n" || input_string[i] === "\t" || input_string[i] === ",") {
        return __lisp__recur__$6(i + 1, paren_count, output_list);
      } else if (input_string[i] === "~" && i != input_string.length && input_string[i + 1] === "@") {
        return __lisp__recur__$6(i + 2, paren_count, append_$33_(output_list, "~@"));
      } else if (input_string[i] === "`" || input_string[i] === "~" || input_string[i] === "'") {
        return __lisp__recur__$6(i + 1, paren_count, append_$33_(output_list, input_string[i]));
      } else if (input_string[i] === ";") {
        return __lisp__recur__$6((function __lisp__recur__$12(j) {
          if (j === input_string.length || input_string[j] === "\n") {
            return j;
          } else {
            return __lisp__recur__$12(j + 1);
          };
        })(i), paren_count, output_list);
      } else if (input_string[i] === "\"") {
        var end = (function __lisp__recur__$15(a) {
          if (a === input_string.length) {
            return a;
          } else if (input_string[a] === "\\") {
            return __lisp__recur__$15(a + 2);
          } else if (input_string[a] === "\"") {
            return a;
          } else {
            return __lisp__recur__$15(a + 1);
          };
        })(i + 1);
        return __lisp__recur__$6(end + 1, paren_count, append_$33_(output_list, input_string.slice(i, end + 1)));
      } else {
        var end = getIndexOfValidStar(input_string, i + 1);
        var t = input_string.slice(i, end);
        if (t[0] === "." && output_list[output_list.length - 1] === ")") {
          var p = 1;
          var j = output_list.length - 1;
          append_$33_(output_list, "", "", "");
          output_list[j + 3] = output_list[j];
          return __lisp__recur__$6(end, paren_count, (function __lisp__recur__$18(j, p, output_list) {
            output_list[j + 3] = output_list[j];
            if (output_list[j] === ")") {
              return __lisp__recur__$18(j - 1, p + 1, output_list);
            } else if (output_list[j] === "(") {
              if (p - 1 === 0) {
                output_list[j] = "(";
                output_list[j + 1] = GET_DOT;
                output_list[j + 2] = t;
                return append_$33_(output_list, ")");
              } else {
                return __lisp__recur__$18(j - 1, p - 1, output_list);
              }
            } else {
              return __lisp__recur__$18(j - 1, p, output_list);
            };;
          })(j - 1, p, output_list));
        } else if (t[0] === "." && i > 0 && input_string[i - 1] != " " && input_string[i - 1] != "\t" && input_string[i - 1] != "\n" && input_string[i - 1] != "{" && input_string[i - 1] != "(" && input_string[i - 1] != "}" && input_string[i - 1] != ")") {
          return __lisp__recur__$6(end, paren_count, (function () {
            var last = output_list[output_list.length - 1];
            output_list[output_list.length - 1] = "(";
            return append_$33_(output_list, "get", last, "\"" + t.slice(1) + "\"", ")");
          })());
        } else if (t[0] === "." && input_string[i - 1] === "\"") {
          return __lisp__recur__$6(end, paren_count, (function () {
            output_list[output_list.length - 1] = output_list[output_list.length - 1] + t;
            return output_list;
          })());
        } else {
          return __lisp__recur__$6(end, paren_count, append_$33_(output_list, t));
        };
      };
    })(0, 0, []);
  };

  var parser = function (l) {
    var parser_get_tag = {
      "'": "quote",
      "~": "unquote",
      "~@": "unquote-splice",
      "`": "quasiquote"
    };
    if (l === null) {
      return null;
    } else {
      return (function __lisp__recur__$21(i, lists, current_list_pointer, temp) {
        if (i < 0) {
          return current_list_pointer;
        } else if (l[i] === ")") {
          return __lisp__recur__$21(i - 1, cons(current_list_pointer, lists), null);
        } else if (l[i] === "(") {
          if (i != 0 && l[i - 1] === "~@" && l[i - 1] === "'" && l[i - 1] === "~" && l[i - 1] === "`") {
            return __lisp__recur__$21(i - 2, cdr(lists), cons(cons(parser_get_tag[l[i - 1]], cons(current_list_pointer, null)), car(lists)), lists);
          } else {
            return __lisp__recur__$21(i - 1, cdr(lists), cons(current_list_pointer, car(lists)), lists);
          }
        } else {
          if (i != 0 && l[i - 1] === "~@" && l[i - 1] === "'" && l[i - 1] === "~" && l[i - 1] === "`") {
            return __lisp__recur__$21(i - 2, lists, cons(cons(parser_get_tag[l[i - 1]], cons(l[i], null)), current_list_pointer), l[i]);
          } else {
            return __lisp__recur__$21(i - 1, lists, cons(l[i], current_list_pointer), l[i]);
          }
        };
      })(l.length - 1, null, null, null);
    };
  };

  var quote_list = function (l) {
    if (l === null) {
      return null;
    } else if (l.first instanceof List) {
      return cons("cons", cons(quote_list(l.first), cons(quote_list(l.rest), null)));
    } else if (l.first === ".") {
      return cons("quote", cons(l.rest.first, null));
    } else {
      return cons("cons", cons(cons("quote", cons(l.first, null)), cons(quote_list(l.rest), null)));
    };
  };

  var quasiquote_list = function (l) {
    if (l === null) {
      return null;
    } else if (l.first instanceof List) {
      if (l.first === "unquote") {
        return cons("cons", cons(l.rest.first, cons(quasiquote_list(l.rest), null)));
      } else if (l.first === "unquote-splice") {
        return cons("append", cons(l.rest.first, cons(quasiquote_list(l.rest), null)));
      } else {
        return cons("cons", cons(quasiquote_list(l.first), cons(quasiquote_list(l.rest), null)));
      }
    } else if (l.first === ".") {
      return cons("quote", cons(l.rest.first, null));
    } else {
      return cons("cons", cons(cons("quote", cons(l.first, null)), cons(quasiquote_list(l.rest), null)));
    };
  };

  var validateName = function (var_name) {
    return (function __lisp__recur__$24(o, i) {
      if (i === var_name.length) {
        if (_$33_(isNaN(o[0]))) {
          return "_" + o;
        } else {
          return o;
        }
      } else {
        var code = var_name.charCodeAt(i);
        if (code > 47 && code < 58 || code > 64 && code < 91 || code > 96 && code < 123 || var_name[i] === "$" || var_name[i] === "_" || var_name[i] === "." || var_name[i] === "&" || code > 255) {
          return __lisp__recur__$24(o + var_name[i], i + 1);
        } else {
          return __lisp__recur__$24(o + "_$" + code + "_", i + 1);
        };
      };
    })("", 0);
  };

  var formatParams = function (params) {
    return (function __lisp__recur__$27(o, params) {
      if (params === null) {
        return o + ")";
      } else {
        var p = compiler(params.first, param_or_assignment = true);
        if (typeof p === "string" && p[0] === ":") {
          return __lisp__recur__$27(o + p.slice(1) + "=", params.rest);
        } else {
          return __lisp__recur__$27(o + p + (params.rest != null ? ", " : ""), params.rest);
        };
      };
    })("(", params);
  };

  var formatKey = function (p) {
    if (validateName(p) === p && isNaN(p)) {
      return p;
    } else {
      return "\"" + p + "\"";
    };
  };

  var compiler = function (l) {
    var is_last_exp = arguments[1] === undefined ? null : arguments[1];
    var is_recur = arguments[2] === undefined ? null : arguments[2];
    var need_return_string = arguments[3] === undefined ? null : arguments[3];
    var param_or_assignment = arguments[4] === undefined ? null : arguments[4];
    var current_fn_name = arguments[5] === undefined ? null : arguments[5];
    if (l === null) {
      if (need_return_string) {
        return "return null";
      } else {
        return "null";
      }
    } else if (l instanceof List) {
      if (l.first === "def" || l.first === "=" || l.first === "set!" || l.first === "const") {
        var var_name = compiler(car(cdr(l)));
        var var_value = compiler((function () {
          if (cdr(cdr(l)) === null) {
            return null;
          } else if (cdr(cdr(cdr(l))) != null) {
            return cons("fn", cons(car(cdr(cdr(l))), cdr(cdr(cdr(l)))));
          } else {
            return l.rest.rest.first;
          }
        })(), current_fn_name = var_name);
        var o = (function () {
          if (l.first === "def") {
            return "var";
          } else if (l.first === "const") {
            return "const";
          } else {
            return "";
          }
        })() + var_name + " = " + var_value + " ";
        if (need_return_string) {
          return o + "; return " + var_name;
        } else {
          return o;
        };
      } else if (l.first === "Array") {
        return (need_return_string ? "return [" : "[") + (function __lisp__recur__$30(l, output) {
          if (l === null) {
            return output;
          } else {
            return __lisp__recur__$30(cdr(l), output + compiler(car(l), param_or_assignment = true) + (cdr(l) === null ? "" : ", "));
          };
        })(cdr(l), "") + "]";
      } else if (l.first === "Object") {
        return (need_return_string ? "return {" : "{") + (function __lisp__recur__$33(l, output) {
          if (l === null) {
            return o + "}";
          } else {
            var key = compiler(l.first, param_or_assignment = true);
            if (key[0] === ":") {
              if (l.rest != null && l.rest.first[0] != ":") {
                return __lisp__recur__$33(l.rest.rest, o + formatKey(key.slice(1)) + ": " + compiler(l.rest.first, param_or_assignment = true) + (l.rest.rest != null ? ", " : ""));
              } else {
                return __lisp__recur__$33(l.rest, o + key.slice(1) + (l.rest != null ? ", " : ""));
              }
            } else if (key[0] === "'" || key[0] === "\"") {
              return __lisp__recur__$33(l.rest.rest, o + key + ": " + compiler(l.rest.first, param_or_assignment = true) + (l.rest.rest != null ? ", " : ""));
            } else {
              return __lisp__recur__$33(l.rest.rest, o + "[" + key + "]: " + compiler(l.rest.first, param_or_assignment = true) + (l.rest.rest != null ? ", " : ""));
            };
          };
        })(cdr(l), "");
      } else if (l.first === GET_DOT) {
        var k = formatKey(l.rest.first.slice(1));
        return (need_return_string ? "return " : "") + compiler(l.rest.rest.first) + (k[0] === "\"" ? "[" + k + "]" : "." + k);
      } else if (l.first === "quote" || l.first === "quasiquote") {
        if (l.rest.first instanceof List) {
          var v = compiler(tag === "quote" ? quote_list(l.rest.first) : quasiquote_list(l.rest.first));
          if (need_return_string) {
            return "return " + v;
          } else {
            return v;
          };
        } else if (l.rest === null) {
          if (need_return_string) {
            return "return null";
          } else {
            return "null";
          }
        } else if (isNaN(l.rest.first)) {
          if (need_return_string) {
            return "return \"" + l.rest.first + "\"";
          } else {
            return "\"" + l.rest.first + "\"";
          }
        } else {
          if (need_return_string) {
            return "return " + l.rest.first;
          } else {
            return l.rest.first;
          }
        }
      } else return null;
    } else return null;
  };

  var lisp_compiler = function () {};

  var macro = {};
  var GET_DOT = 1;
  var ARRAY_OBJECT_GET = 3;
  var eval_result = "";
  var global_context = null;
  var recursion_function_name_count = 0;

  ;
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

  ;

  ;

  ;

  ;

  ;

  ;

  ;

  ;
  return null;
};
lisp_module();
