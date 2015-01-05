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
