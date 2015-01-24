lisp2js beta
=======
#### By Yiyi Wang (shd101wyy)

##### Simple Lisp that compiles to JavaScript (targeting ECMAScript 6)  
##### So ECMAScript 5 might not work.  
---------------

#### Installation
```sh
    node -g install lisp2js  
```
#### How to run  
```sh
    lisp                               # repl
    lisp   [file1.lisp]                # run file1.lisp
    lisp   [file1.lisp]  [file2.js]    # compile [file1.lisp] to js file [file2.js]
```
----------------
### [Try it Online](http://rawgit.com/shd101wyy/lisp2js_demo/master/index.html)
----------------
#### all comma, tab, space will be ignored.
----------------
#### Examples
-     <strong> Basics </strong>
-     comment
```lisp
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
    // es6
    var add = function(a=12, b=3){
        return a + b;
    }
```

- call function with assigned parameters
```lisp
    (add :a 20 :b 40)
```
```javascript
    add(a = 20, b = 40);
```
- define function with rest parameters
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

- anonymous function
```lisp
    (fn (a :b 13 & c)
        (+ a b c[0]))
```
```javascript
// es6
    function(a, b = 13, ...c) {
        return (a + b + c[0]);
    };
```

- if
```lisp
    (if 1 2 3)
    (def x (if 1 2 3))
```
```javascript
    (1 ? 2 : 3);
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
- do. run a series of exps.
```lisp
    (do  (+ 1 2)
         (- 3 4)
         (* 5 6))
```
```javascript
    (function() {
        (1 + 2);
        (3 - 4);
        return (5 * 6);
        })();
```

- let
```lisp
    (let x 1
        y 2
        x (+ x y)
        z 4
        (+ x y z))
    (let a 1
         b 2
        (do (+ a b)
            (- a b)))
```
```javascript
    ((function() {
        var x = 1;
        var y = 2;
        x = (x + y);
        var z = 4;
        return (x + y + z)
    })());
    ((function() {
        var a = 1;
        var b = 2;
        (a + b);
        return (a - b);
    })());
```
- try/catch/finally
```lisp
    (try (do
        (console.log "This is try"))
    catch e (do
        (console.log "This is catch"))
    finally (do
        (console.log "This is finally")))
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
```
```javascript
    (1 === 1);
    (1 + 2 + 3);
    (1 - 2 - 3);
    (1 * 2 * 3);
    (1 / 2 / 3);
    ((1 + 2) * (3 - 4));
    (1 > 2 > 3 > 4);
    (1 <= 2 <= 3 <= 4);
    (true && false);
    (1 || 2);
    (1 | 0x12);
```

- get  
```lisp
    (get "abcd" 'length)
```
```javascript
    "abcd"["length"]
```

- new
```lisp
    (def x (new Array 1 2 3 4))
```
```javascript
    var x = (new Array(1, 2, 3, 4));
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
##### similar like recur in clojure
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
However, the macro implementation still has errors.
---------------------------------------
#### Change Log
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
---------------------------------------
MIT License ;)
