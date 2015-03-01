lisp2js beta
=======
#### By Yiyi Wang (shd101wyy)

##### Simple Lisp that compiles to JavaScript ~~(targeting ECMAScript 6)~~
##### ~~So ECMAScript 5 might not work.~~
###### As es6 is not fully supported, the language will compile to es5.  
---------------
#### npm / github
[npm](https://www.npmjs.com/package/lisp2js)  
[github](https://github.com/shd101wyy/lisp2js)
#### Installation
```sh
    npm -g install lisp2js  
```
#### How to run  
```sh
    lisp                               # repl
    lisp   [file1.lisp]                # run file1.lisp
    lisp   [file1.lisp]  [file2.js]    # compile [file1.lisp] to js file [file2.js]
```
----------------
#### Use lisp2js in Browser
```html
<script src="lisp.js"></script>
<script>
    var output = lisp.compile("(def x 12)"); // compile/eval expression, then return compiled result.
</script>
```
----------------
### [Click Me to Try it Online](https://rawgit.com/shd101wyy/lisp2js/master/demo/translater.html)
### [Online REPL](https://rawgit.com/shd101wyy/lisp2js/master/demo/repl.html)
----------------
#### all comma, tab, space will be ignored.
----------------
#### Examples
<strong> Basics </strong>
-     comment
```lisp
    ; semicolon is used as comment
    ;; this is comment
```

-     define variable value
```lisp
    (def x 12)
    (def ->this*name$invalid@in*js 13)   ;; a invalid js variable name, which will be replaced with another name.
    (def ** Math.pow)
```
```javascript
    var x = 12;
    var _$45__$62_this_$42_name$invalid_$64_in_$42_js = 13;  // all invalid characters are replaced with its own charcode.
    var _$42__$42_ = Math.pow;
```

- change variable value  
```lisp
    (= x 15)  
```
```javascript
    x = 15;
```

- define function
```lisp
    (def add (a b)
        (+ a b))
```
```javascript
    var add = function(a, b){
        return a + b;
    }
```

- call function
```lisp
    (add 3 4)
```
```javascript
    add(3, 4);
```

- define function with default parameters
```lisp
    (def add (:a 12 :b 3)
        (+ a b))
```
```javascript
    var add = function(a, b) {
        a = (a === void 0 ? 12 : a);
        b = (b === void 0 ? 3 : b);
        return (a + b);
    };
```

- define function with keyword parameters
```lisp
    (def add (x {:y 1 :z 2})
        (+ x y z))
    (add 0)        ;;  3
    (add 1 :y 3)   ;;  6
```
```javascript
    var add = function(x, __lisp_args__) {
        var __lisp_args_v__;
        __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
        var y = ((__lisp_args_v__ = __lisp_args__.y) === void 0 ? 1 : __lisp_args_v__);
        var z = ((__lisp_args_v__ = __lisp_args__.z) === void 0 ? 2 : __lisp_args_v__);
        return (x + y + z);
    };
    add(0);
    add(1, {
        y: 3
    });
```

- call function with named(keyword) parameters  
```lisp
    (def add ({:a 1 :b 2}) (+ a b))
    (add)                  ;; => 3
    (add :a 3 :b 4)        ;; => 7
    (add :b 3)             ;; => 4
```
```javascript
    var add = function(__lisp_args__) {
        var __lisp_args_v__;
        __lisp_args__ = (__lisp_args__ === void 0 ? {} : __lisp_args__);
        var a = ((__lisp_args_v__ = __lisp_args__.a) === void 0 ? 1 : __lisp_args_v__);
        var b = ((__lisp_args_v__ = __lisp_args__.b) === void 0 ? 2 : __lisp_args_v__);
        return (a + b);
    };
    add();
    add({
        a: 3,
        b: 4
    });
    add({
        b: 3
    });
```

- define function with rest parameters
```lisp
    (def add (a & b)   ;; b here is Array
        (+ a b[0]))
    (def add (a . b)   ;; b here is List
        (+ a (car b)))
```
```javascript
    var add = function(a) {
        for (var b = [], $__0 = 1; $__0 < arguments.length; $__0++) b[$__0 - 1] = arguments[$__0];
        return (a + b[0]);
    };
    var add = function(a) {
        for (var b = [], $__0 = 1; $__0 < arguments.length; $__0++) b[$__0 - 1] = arguments[$__0];
        b = list.apply(null, b);
        return (a + car(b));
    };
```

- anonymous function
```lisp
    (fn (a :b 13 & c)
        (+ a b c[0]))
```
```javascript
    function (a, b){
        for (var c = [], $__0 = 2; $__0 < arguments.length; $__0++) c[$__0 - 2] = arguments[$__0];
        b = (b === void 0 ? 13 : b);
        return (a + b + c[0]);
    };
```

- do. run a series of exps.
```lisp
    (do  (+ 1 2)
         (- 3 4)
         (* 5 6))

    (fn ()
        (do (+ 1 2)
            (- 3 4)
            (* 5 6)))
    (if 1
        (do (def x 1) (def y 2))
        (do (def x 2) (def y 1)))
```
```javascript
    (1 + 2);
    (3 - 4);
    (5 * 6);;

    function() {
        (1 + 2);
        (3 - 4);
        return (5 * 6);;
    };
    if (1) {
        var x = 1;
        var y = 2;
    } else {
        var x = 2;
        var y = 1;
    };
```

- if
```lisp
    (if 1 2 3)
    (def x (if 1 2 3))
```
```javascript
    if (1) {
        2
    } else {
        3
    };
    var x = (1 ? 2 : 3);
```

- cond
```lisp
    (cond test1 (do stm1 stm2)
          test2 (do stm3 stm4)
          test3 stm5
          else stm6)
```
```javascript
    if (test1) {
      stm1;
      stm2;
    } else if (test2) {
      stm3;
      stm4;
    } else if (test3) {
      stm5;
    } else {
      stm6;
    };
```

- case
```lisp
    (def test (x)
        (case x
            "apple" "This is apple"
            "orange" "This is orange"
            else "This is nothing"))
```
```javascript
    var test = function(x) {
        switch (x) {
            case "apple":
                return "This is apple";
            case "orange":
                return "This is orange";
            default:
                return "This is nothing";
        };
    };
```

- let (es5)  // I might change this to es6 <strong>let</strong> in the future
```lisp
    (let x 1
        y 2
        x (+ x y)
        z 4
        (+ x y z))
    (+ (let x 1 y 2 (- x y))
        3)
    (def test ()
        (let x 1 y 2 (+ x y)))
```
```javascript
    ((function() {
        var x = 1;
        var y = 2;
        x = (x + y);
        var z = 4;
        return (x + y + z)
    })());
    (((function() {
        var x = 1;
        var y = 2;
        return (x - y)
    })()) + 3);
    var test = function() {
        return ((function() {
            var x = 1;
            var y = 2;
            return (x + y)
        })());
    };
```

- throw
```lisp
    (throw "Too Big")
```
```javascript
    throw "Too Big";
```

- yield
```lisp
    (def test ()
        (yield 1)
        (yield 2))
    (def x (test))
    (x.next)   ;; 1
    (x.next)   ;; 2
    (x.next)   ;; stop
```
```javascript
    var test = function() {
        yield 1;
        yield 2;
        return;
    };
    var x = test();
    x.next();
    x.next();
    x.next();
```

- try/catch/finally
```lisp
    (try (console.log "This is try")
    catch e (console.log "This is catch")
    finally (console.log "This is finally"))
```
```javascript
    try {
      console.log("This is try");
    } catch (e) {
      console.log("This is catch");
    } finally {
      console.log("This is finally");
    };
```
- some operators
```lisp
    (== 1 1)
    (+ 1 2 3)
    (- 1 2 3)
    (* 1 2 3)
    (/ 1 2 3)
    (* (+ 1 2) (- 3 4))
    (> 1 2 3 4)
    (<= 1 2 3 4)
    (&& true false)
    (|| 1 2)
    (| 1 0x12)
    (and true false)
    (or true false)
    (not true)
```
```javascript
    (1 === 1);
    (1 + 2 + 3);
    (1 - 2 - 3);
    (1 * 2 * 3);
    (1 / 2 / 3);
    ((1 + 2) * (3 - 4));
    (1 > 2 && 2 > 3 && 3 > 4);
    (1 <= 2 && 2 <= 3 && 3 <= 4);
    (true && false);
    (1 || 2);
    (1 | 0x12);
    (true && false);
    (true || false);
    (!true);
```

- get  
```lisp
    (get "abcd" 'length)
    (get console .log)
```
```javascript
    "abcd"["length"];
    console.log;
```

- ->
```lisp
    (-> console (.log "Hello World"))
    (-> $ (.post "test.php")
          (.done (fn () "done"))
          (.fail (fn () "fail")))
    (-> "i am cool"
        .length)
```
```javascript
    console.log("Hello World");
    $.post("test.php").done(function() {
        return "done";
    }).fail(function() {
        return "fail";
    });
    "i am cool".length;
```

- loop
```lisp
    ;; calculate factorial 10
    (loop i 10
          acc 1
        (if (== i 0)
            acc
            (recur (- i 1)
                   (* i acc))))
```
```javascript
    (function __lisp__recur__$0(i, acc) {
        if ((i === 0)) {
            return acc
        } else {
            return __lisp__recur__$0((i - 1), (i * acc))
        };
    })(10, 1);
```

- new
```lisp
    (def x (new Array 1 2 3 4))
```
```javascript  
    var x = (new Array(1, 2, 3, 4));
```
- in  
```lisp
    (in 'a {'a 12})
```
```javascript  
    ("a" in {"a": 12});
```  

- instanceof
```lisp
    (instanceof [1 2 3] Array)
```
```javascript
    ([1, 2, 3] instanceof Array)
```
-----------------------------------------
-  <strong> List functions </strong>
     * To enable <strong>List</strong> datatype, include lisp.js from https://github.com/shd101wyy/List_for_FP
     *  after you compile your .lisp file to javascript file.
     *  This file will give you 4 functions: car, cdr, cons, list.  
     *                      and 1 datatype: $List  
     *  See the link above for more information.
- define a list.
```lisp
    (def x '(1 2 3))
```
```javascript
    var x = cons(1, cons(2, cons(3, null)));
```

- quasiquote
```lisp
    (def x 12)
    `(~x x)     ;; => (12 x)
```
```javascript
    var x = 12;
    cons(x, cons("x", null));
```

- car, cdr, cons, list
```lisp
    (def a 1)
    (def b 2)
    (def c (cons a (cons b '())))   ;; => (1 2)
    (car c)                         ;; => 1
    (cdr c)                         ;; => (2)
    (def l (list a b))           ;; => (1 2)
```
```javascript
    var a = 1;
    var b = 2;
    var c = cons(a, cons(b, null));
    car(c);
    cdr(c);
    var l = list(a, b);
```
---------------------------------------
- <strong>Use JavaScript Object/Array</strong>

- define Array
```lisp
    (def x [1 2 3])
```
```javascript
    var x = [1, 2, 3];
```

- define Object
```lisp
    (def x {:a 12 b 13 "c" 14})
```
```javascript
    // es6
    var x = {a: 12, [b]: 13, "c": 14};
```

- es6 define value
```lisp
    (def [x y z] [1 2 3])
    (def {:m :n} {:m 12 :n 20})
```
```javascript
    // es6
    var [x, y, z] = [1, 2, 3];
    var {
        m, n
    } = {
        m: 12,
        n: 20
    };
```

- change value  
```lisp
    (def x [1 2 3])
    (= x[0] 12)
    (def y {:a 12 :b 13 :c (fn (a b) (+ a b))})
    (= y.a 13)
    (= y["a"] 13)
```
```javascript
    var x = [1, 2, 3];
    x[0] = 12;
    var y = {
        a: 12,
        b: 13,
        c: function(a, b) {
            return (a + b);
        }
    };
    y.a = 13;
    y["a"] = 13;
```

- get value
```lisp
    (def y {:a 12 :b 13 :c (fn (a b) (+ a b))})
    (y.add y.a y.b)
```
```javascript
    var y = {
        a: 12,
        b: 13,
        c: function(a, b) {
            return (a + b);
        }
    };
    y.add(y.a, y.b);
```
---------------------------------------
#### recur
##### similar to recur in clojure
- recur
```lisp
    (def test (n)
      (cond (== n 0) 0
            1 (recur (- n 2))                ;; recur here means test
            else (recur (- n 1))))

    ;; anonymous function recur
    ((fn (n acc)
      (if (== n 0)
        acc
        (recur (- n 1) (* n acc)))) 10 1)  ;; recur <=> that anonymous function
```
```javascript
    var test = function(n) {
      if ((n === 0)) {
        return 0;
      } else if (1) {
        return test((n - 2));
      } else {
        return test((n - 1));
      };
    };
    (function __lisp__recur__$0(n, acc) {
      if ((n === 0)) {
        return acc;
      } else {
        return __lisp__recur__$0((n - 1), (n * acc));
      };
    })(10, 1)
```
---------------------------------------
#### Macro
- define a macro  
```lisp
    (defmacro square (x) `(* ~x ~x))
    (square 12)
    (defmacro square-with-different-params
        (x) `(* ~x ~x)
        (x y) `(+ (* ~x ~x) (* ~y ~y)))
    (square-with-different-params 12)
    (square-with-different-params 15 16)
```
```javascript
    (12 * 12);
    (12 * 12);
    ((15 * 15) + (16 * 16));
```
###### However, the macro implementation still has errors.
---------------------------------------
#### Change Log
- <strong> Version 0.0.28 </strong>
- <strong> 2015/3/1 </strong>
    * add <strong>case</strong> statement.  
    * eg:  
    ```lisp
        (def test (x)
            (case x
                "apple" "This is apple"
                "orange" "This is orange"
                else "This is nothing"))
        (test "pear")    ;; => This is nothing
        (test "apple")   ;; => This is apple
        (test "orange")  ;; => This is orange
    ```
    * fix one <strong>if</strong> and <strong>cond</strong> bug.
- <strong> 2015/2/25 </strong>
    * fix demo link error.
- <strong> 2015/2/24 </strong>
    * add <strong>loop</strong> macro
    * eg:
    ```lisp
        ;; calculate factorial 10
        (loop i 10
              acc 1
            (if (== i 0)
                acc
                (recur (- i 1)
                       (* i acc))))
    ```
- <strong> 2015/2/23 </strong>
    * add REPL demo
    * fix <= >= < > == != comparison operator bug, they now support multiple arguments.
    * eg:
    ```lisp
        (== 1 1 1)
        (<= 1 2 3 4 5 2)
    ```
- <strong> Version 0.0.24 </strong>
- <strong> 2015/2/22 </strong>
    * add <strong> -> </strong> macro
    * eg:
    ```lisp
        (-> console (.log "Hello World"))
        (-> $ (.post "test.php")
              (.done (fn () "done"))
              (.fail (fn () "fail")))
        (-> "i am cool"
            .length)
    ```
    ```javascript
        console.log("Hello World");
        $.post("test.php").done(function() {
            return "done";
        }).fail(function() {
            return "fail";
        });
        "i am cool".length;
    ```
- <strong> Version 0.0.20 - 0.0.22 </strong>
- <strong> 2015/2/17 </strong>
    * <strong> Happy New Year []~(￣▽￣)~* </strong>
    * Add <strong> and, or, not </strong> macros that behave the same as <strong> &&  ||  !</strong>
    * Change <strong>default parameters</strong> and <strong>keyword parameters</strong>.
    * For example:
    * <strong> Default Parameters </strong>
    ```lisp
        (def add (:a 1 :b 2)
            (+ a b))
        (add)     ;; => 3
        (add 2)   ;; => 4
        (add 3 4) ;; => 7
    ```
    * <strong> Keyword Parameters </strong>
    *
    ```lisp
        (def add ({:x 1 :y 2})
            (+ x y))
        (add)            ;; => 3
        (add :x 3)       ;; => 5
        (add :y 6)       ;; => 7
        (add :x 4 :y 5)  ;; => 9
        (add :y 1 :x 5)  ;; => 6
    ```
- <strong> Version 0.0.18 </strong>
- <strong> 2015/2/16 </strong>
    * Add <strong>yield</strong> and <strong> throw </strong> support.
- <strong> 2015/2/9 </strong>
    * Improve compatibility with es5
- <strong> 2015/2/7 </strong>
    * Change the way of defining the default parameters and calling function with named parameters
- <strong> 2015/1/31 </strong>
    * Fix one macro bug.  
- <strong> 2015/1/26 </strong>
    * Change <strong> do </strong> function.  
      (do ...) will be wrapped as function when it is argument or assignment value.
- <strong> Version 0.0.13 </strong>
    * add <strong> in </strong> support.
    ```lisp
    (in 'a {'a 12})
    ```
    ```javascript
    ("a" in {"a": 12});
    ```
- <strong> Version 0.0.12 </strong>
    * fix one macro bug.
- <strong> 2015/1/23 </strong>
    * change . & for rest parameters  
    * . => list
    * & => array  
    ```lisp
    (def add (a & b)   ;; b here is Array
        (+ a b[0]))
    (def add (a . b)   ;; b here is List
        (+ a (car b)))
    ```
    ```javascript
    // es6
    var add = function(a, ...b){
        return a + b[0];
    }
    var add = function(a, ...b) {
        b = list.apply(null, b);
        return (a + car(b));
    };
    ```
- <strong>2015/1/19 </strong>
    * add <strong> get </strong> fn  
    * fix "abc".length like exp bug.  
- <strong>2015/1/14 </strong>
    * add <strong> cond </strong>
    * add <strong> recur </strong> support
    * add <strong> try/catch/finally </strong> support
    * change <strong>if</strong> statement  
    Went snowboarding and fell down too many times. I twisted my wrist unfortunately. (T_T)  

- <strong>2015/1/7 </strong>
    * add support for fn with name .
```lisp
    (fn add (x) (+ x y))
```
```javascript
    function add(x) {
        return (x + y);
    };
```
    * fix one macro bug
- <strong>2015/1/5 </strong>
    * add support for <strong> const </strong>
    * change <strong> let </strong>. see doc above.
    * fix several bugs.
- <strong>2015/1/5 First Release</strong>
    * There are still lots of bugs.  
    * ...
---------------------------------------
MIT License ;)
