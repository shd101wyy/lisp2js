;($ .post "test.php"
;   .done (fn () "done")
;   .fail (fn () "fail")
;   .test :x 1 :y 2
;   .done)

;(x .test .next .done)

(def test ({:x 12 :y 13})
    (+ x y))
(test)

(-> $ (.post "test.php")
      (.done (fn () "done"))
      (.fail (fn () "fail"))
      (.test (fn () "test")))

(test :a 12 :b 13 x y)

(== 1 1)
(+ 1 2 3)
(- 1 2 3)
(* 1 2 3)
(/ 1 2 3)
(* (+ 1 2) (- 3 4))
(> 1 2 3 4)
(<= 1 2 3 4)
(&& true false)
(|| 1 2)
(| 1 0x12)
(and true false)
(or true false)
(not true)
