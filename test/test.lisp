;($ .post "test.php"
;   .done (fn () "done")
;   .fail (fn () "fail")
;   .test :x 1 :y 2
;   .done)

;(x .test .next .done)

(def test ({:x 12 :y 13})
    (+ x y))
(test)
