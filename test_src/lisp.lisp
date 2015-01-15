(def List (first rest)
  (= this.first first)
  (= this.rest rest)
  '())
;;; list length
(= List.prototype.length ()
  (def list_length (l acc)
    (if (== l null)
      acc
      (list_length l.rest (+ acc 1))))
  (list_length this 0))

;;; toString
(= List.prototype.toString ()
    (fn to_string (l output)
      (cond (== l null) (+ output ")")
            (instanceof l List) (to_string l.rest
                                           (+ output
                                              (if (== l.first null)
                                                  "()"
                                                  (l.first.toString))
                                              (if (== l.rest null)
                                                  ""
                                                  ",")))
            else (+ (output.slice 0 -2)
                    " . "
                    (l.toString())
                    ")")
            ))
    (to_string this "("))


(def test (n)
  (cond (== n 0) 0
        1 (recur (- n 2))
        else (recur (- n 1))))
(console.log ((fn (n acc)
  (if (== n 0)
    acc
    (recur (- n 1) (* n acc))))
    10 1))

(try (do
        (console.log "This is try"))
 catch e (do
            (console.log "This is catch"))
 finally (do
            (console.log "This is finally")))

(fn test (n)
  (if (== n 0)
    1
    (recur (- n 1))))

(cond test1 (do stm1 stm2)
      test2 (do stm3 stm4)
      test3 stm5
      else stm6)
