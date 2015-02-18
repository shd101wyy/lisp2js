;; simple ratio library
;; from sicp

(def add-rat (x y)
  (make-rat (+ (* (numer x) (denom y))
               (* (numer y) (denom x)))
            (* (denom x) (denom y))))

(def sub-rat (x y)
  (make-rat (- (* (numer x) (denom y))
               (* (numer y) (denom x)))
            (* (denom x) (denom y))))

(def mul-rat (x y)
  (make-rat (* (numer x) (numer y))
            (* (denom x) (denom y))))

(def div-rat (x y)
  (make-rat (* (numer x) (denom y))
            (* (denom x) (numer y))))

(def equal-rat? (x y)
  (== (* (numer x) (denom y))
     (* (numer y) (denom x))))

;; gcd
(def gcd (a b)
    (if (== b 0)
        a
        (gcd b (% a b))))

;; construct rat datatype
(def Ratio (n d)
    (= this.n n)
    (= this.d d))
(def make-rat (n d)
    (let g (gcd n d)
        (new Ratio (/ n g) (/ d g))))
(def numer (x) x.n)
(def denom (x) x.d)

;; print ratio
(def print_rat (x)
    (if (== (denom x) 1)
        (console.log (numer x))
        (console.log (+ (numer x) "/" (denom x)))))

(def print_r (x)
    (if (== x.constructor Ratio)
        (print_rat x)
        (console.log x)))

;; check number integer
(def integer? (x) Number.isInteger)

;; check number float
(def float? (x) (&& (== (typeof x) "number") (not (integer? x))))

;; check ds is ratio
(def ratio? (x) (== x.constructor Ratio))

;; extend javascript arithmetics
(def r+ (x y)
    (if (and (ratio? x)
             (ratio? y))
        (add-rat x y)
        (+ x y)))

(def r- (x y)
    (if (and (ratio? x)
             (ratio? y))
        (sub-rat x y)
        (- x y)))

(def r* (x y)
    (if (and (ratio? x)
             (ratio? y))
        (mul-rat x y)
        (* x y)))

(def r/ (x y)
    (cond   (and (ratio? x) ;; 2 ratio
                (ratio? y))
            (div-rat x y)
            (and (integer? x) ;; 2 integer
                (integer? y))
            (make-rat x y)
            else
            (/ x y)))

;; demo
(def demo ()
    (print_rat (add-rat (make-rat 4 3) (make-rat 5 3)))
    (print_rat (mul-rat (make-rat 4 3) (make-rat 12 18)))
    (print_r (r/ 3 4))
    (print_r (r+ (r/ 3 4) (r/ 6 5)))
    )
;; uncomment to run demo
;(demo)
