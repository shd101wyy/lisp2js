(def test () '(+ 1 3))
(defmacro t () (test))
(console.log (t))
(def add (:x 12 :y 15)
    (+ x y))
(add[a].add[0].test a.b[3] 12)

(def MyObject (age)
    (= this.age age))
(def o (new MyObject 12))
(console.log o.age)
(console.log o)

(def add (x y) (+ x y))
(apply add [1 2])


(let x 1
    y 2
    x (+ x y)
    z 4
    (+ x y z))
(let a 1
    b 2
    (do (+ a b)
    (- a b)))

(defmacro square (x) `(* ~x ~x))
(square 12)
(defmacro square-with-different-params
        (x) `(* ~x ~x)
        (x y) `(+ (* ~x ~x) (* ~y ~y)))
(square-with-different-params 12)
(square-with-different-params 15 16)
