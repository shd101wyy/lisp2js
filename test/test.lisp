(def parse-loop (args)
(def parse-loop-helper (a var-names var-vals)
(def null? (o) (== o null))
(cond (null? a) (console.log "ERROR: loop invalid statement: " args "\n")
(null? (cdr a)) [(car a), var-names, var-vals]
    else (parse-loop-helper (cdr (cdr a))
    (cons (car a) var-names)
    (cons (car (cdr a)) var-vals))))
    (def parse-result (parse-loop-helper args '() '()))
    (def body parse-result[0])
    (def var-names (parse-result[1].reverse))
    (def var-vals (parse-result[2].reverse))
    (cons `(fn ~var-names ~body) var-vals))

    (defmacro loop
        (. args) (parse-loop args))

(def print console.log)
(console.log "Enter Here")
(loop x 10 acc 1
    (if (== x 0)
        acc
        (do
            (console.log x)
            (recur (- x 1)
                (* x acc)))))
(console.log "Done")
