(def List (first rest)
  (= this.first first)
  (= this.rest rest)
  '())

(= List.prototype.length ()
  (def list_length (l acc)
    (if (== l null)
      acc
      (list_length l.rest (+ acc 1))))
  (list_length this 0))
(console.log "Hi There")
