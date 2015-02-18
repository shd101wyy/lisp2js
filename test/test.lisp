(console.log ((fn (n acc)
      (if (== n 0)
        acc
        (recur (- n 1) (* n acc)))) 10 1))  ;; recur <=> that anonymo
