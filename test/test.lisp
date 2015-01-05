(defmacro square (x) `(* ~x ~x))
(square 12)
(let x 1
     y 2
     z 3
     (+ x y))

(def add (:a 12 :b 20 . c)
    (+ a b))
(add 3 4 5 6)

(def x '(1 2 3))

(def x 12)
`(~x x)

(def a 1)
(def b 2)
(def c (cons a (cons b '())))   ;; => (1 2)
(car c)                         ;; => 1
    (cdr c)                         ;; => (2)
    (def list (list a b))           ;; => (1 2)

(def x [1 2 3])
(def x {:a 12 b 13 "c" 14})


(def x [1 2 3])
(= x[0] 12)
(def y {:a 12 :b 13 :c (fn (a b) (+ a b))})
(= y.a 13)
(= y["a"] 13)


(def y {:a 12 :b 13 :c (fn (a b) (+ a b))})
(y.add y.a y.b)

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

(if 1 2 3)
(def x (if 1 2 3))

(do  (+ 1 2)
(- 3 4)
(* 5 6))

(let x 1
    y 2
    x (+ x y)
    z 4
    (+ x y z))
(let a 1
     b 2
    (do (+ a b)
        (- a b)))


(def x (new Array 1 2 3 4))
