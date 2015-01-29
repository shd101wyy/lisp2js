(fn add (i)
    (cond (== i 0)
        0
        else
        (recur (- i 1))))

(fn (x y)
    (if (== x 0)
        y
        (do (def z 12)
            (recur  (- x 1)
                (+ y 1)))))

                (def test (n)
                  (cond (== n 0) 0
                        1 (recur (- n 2))                ;; recur here means test
                        else (recur (- n 1))))

                ;; anonymous function recur
                ((fn (n acc)
                  (if (== n 0)
                    acc
                    (recur (- n 1) (* n acc)))) 10 1)  ;; recur <=> that anonymous function
