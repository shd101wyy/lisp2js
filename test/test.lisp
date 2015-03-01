(:= x 12)
(def test (x)
    (case x
        0 1
        1 (do 2 3)
        12 "Yoo")
    123)
(case x
    0 1
    else 13
    1 (do 1 2)
    12 "Hi")

(console.log (+ (case x 0 1 12 2) 3))

(if (if 1 2 3)
    2 3)

(def test (x)
    (case x
        "apple" "This is apple"
        "orange" "This is orange"
        else "This is nothing"))
