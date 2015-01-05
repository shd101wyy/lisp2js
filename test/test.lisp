(def x 12)
(def y '(1 2 3))
(def print (x) (console.log (x.toString)))
(console.log x)
(console.log (y.toString))

(def null? (x) (== x null))
(def reverse (x)
    (def reverse-helper (x result)
        (if (null? x)
            result
            (reverse-helper (cdr x)
                            (cons (car x)
                                  result))))
    (reverse-helper x '()))

(print (reverse '(1 2 3) ))
