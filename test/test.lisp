(def test (. x)
    x)
(def test (& x)
    x)

(def add (a . b)
    (+ a (car b)))
