;; test def
(def x 12)
(def x 12)
(def ->this*name$invalid@in*js 13)   ;; a invalid js variable name, which will be replaced with another name.
(def ** Math.pow)

;; test set!
(set! x 15)

;; test defn
(defn add [a b]
    (+ a b))

;; call function
(add 3 4)

(defn add [:a 12 :b 3]
    (+ a b))

(defn add [x {:y 1 :z 2}]
    (+ x y z))

(add 0)        ;;  3
(add 1 :y 3)   ;;  6


(defn add [a & b]   ;; b here is Array
    (+ a b[0]))
(defn add [a . b]   ;; b here is List
    (+ a (car b)))

(fn [a :b 13 & c]
    (+ a b c[0]))
