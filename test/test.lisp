(let x 1
    y 2
    x (+ x y)
    z 4
    (+ x y z))
(+ (let x 1 y 2 (- x y))
    3)
(def test ()
    (let x 1 y 2 (+ x y)))
