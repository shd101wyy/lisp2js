
(def add (a :b 2 {:x 3 :y 4})
    (+ a b x y))

(console.log (add 1))
(console.log (add 1 2))
(console.log (add 1 2 :x 4))


(def test (a {:x 1 :y 2} & b)
    (+ a b[0] x y))

(console.log (test 1 :x 3 2 3))
