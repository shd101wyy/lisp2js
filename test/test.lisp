(:= x 12)
(def test (x)
    (case x
        0 1
        1 (do 2 3)
        12 "Yoo"))
(case x
    0 1
    else 13
    1 (do 1 2)
    12 "Hi")

(console.log (+ (case x 0 1 12 2) 3))
