;; church numerals
(def zero 
     (fn (f)
	 (fn (x) x)))
;(def one
;     (fn (f)
;	 (fn (x)
;	     (f x))))

(def add-1
     (fn (n)
	 (fn (f)
	     (fn (x)
		 (f ((n f) x))))))

(def add (m n)
     (fn (f)
	 (fn (x)
	     ((n f)
	      ((m f) x)))))

(def church->int (n)
     ((n (fn (i) (+ i 1))) 0))

(def one (add-1 zero))
(def two (add-1 one))
;; (console.log (church->int (add-1 one)))
;  (console.log (church->int (add one two)))
