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
