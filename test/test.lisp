(def add (a & b)   ;; b here is Array
    (+ a b[0]))
(def add (a . b)   ;; b here is List
    (+ a (car b)))

    (fn (a :b 13 & c)
        (+ a b c[0]))
