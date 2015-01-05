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
    (def add (a . b)
        (+ a b[0]))
```
```javascript
    // es6
    var add = function(a, ...b){
        return a + b[0];
    }
```

- anonymous function
```lisp
    (fn (a :b 13 . c)
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


- some operators
```
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
#### Change Log
- <strong>2015/1/5 First Release</strong>  
  * There are still lots of bugs.  
  * _support try/catch/final/throw_  in the future
  - <strong> Unsolved Bug </strong>  
```lisp
        (x[0].add z[0].b 4)
```
---------------------------------------
MIT License ;)
