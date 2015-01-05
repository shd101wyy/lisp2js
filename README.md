lisp2js
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
#### Examples
-     define variable value  
```lisp
    (def x 12)
```
```javascript
    var x = 12;
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

- define function with default parameters
```lisp
    (def add (:a 12 :b 3)
        (+ a b))
```
```javascript
    var add = function(a=12, b=3){
        return a + b;
    }
```

- define function with rest parameters
```lisp
    (def add (a . b)
        (+ a b[0]))
```
```javascript
    var add = function(a, ...b){
        return a + b[0];
    }
```

-  <strong> List functions </strong>
     * To enable <strong>List</strong> datatype, include lisp.js from https://github.com/shd101wyy/List_for_FP
     *  after you compile your .lisp file to javascript file.
     *  This file will give you 4 functions: car, cdr, cons, list.  
     *                      and 1 datatyep: $List  
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
`(~x x)
```
```javascript
var x = 12;
cons(x, cons("x", null));
```
