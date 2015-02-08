(def add (:a 12 :b 3)
    (+ a b))
(fn (a :b 13 & c)
    (+ a b c[0]))

    (def add (:a 1 :b 2) (+ a b))
    (add)                  ;; => 3
    (add :a 3 :b 4)        ;; => 7
    (add :b 3)             ;; => 4
