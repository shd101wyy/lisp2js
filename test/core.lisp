;; this file is refered from https://github.com/shd101wyy/WalleyLanguage walley_core.wa
(def lisp2js
    {
        :author 'Yiyi-Wang
        "core-version" "0.0.1"
    })

(def List $List)
(def print (x) (console.log (x.toString)))
(def null? (x) (== x '()))
(def not (a) (if a () 1))

(def append (x y)
    (if (== x '())
        y
        (cons (car x)
              (append (cdr x)
                      y))))

;; cond macro
;; eg (cond 1 2 3 4)
(defmacro cond
    () ()
    (#else body) body
    (#else body . rest) (print "ERROR: cond invalid statements.\n")
    (test body) `(if ~test ~body '())
    (test body . rest) `(if ~test ~body (cond ~@rest))
    )

(def ** Math.pow)
;; ########################### LIST ############################
;; some functions for list
(def caar (x) (car (car x)))
(def cadr (x) (car (cdr x)))
(def cddr (x) (cdr (cdr x)))
(def caddr (x) (car (cdr (cdr x))))
(def cdddr (x) (cdr (cdr (cdr x))))
(def cadddr (x) (car (cdr (cdr (cdr x)))))

;; ########################## Array ##########################
(= Array.prototype.toList
    (fn ()
        (def length this.length)
        (def ->list-iter (v i)
            (if (== i length)
                '()
                (cons v[i]
                      (->list-iter v
                                   (+ i 1)))))
        (->list-iter this 0)))

;; foreach
(def foreach (value func)
    (value.forEach func))

;; ########################## High Order Functions ###########
;; map one parameters
;; (list-map1 square '(3 4)) => (9 16)
(def list-map1 (f p)
    (if (null? p)
        '()
        (cons (f (car p))
              (list-map1 f (cdr p)))))
;; map variadic parameters
;; (list-map + '(3 4) '(5 6)) => '(8 10)
(def list-map)
(= list-map (fn (f p0 . p)
    (if (== p0 '())
        '()
        (cons (apply f (list-map1 car (cons p0 p)))
              (apply list-map (cons f (list-map1 cdr (cons p0 p))))))))

;; list-zip
;; (list:zip '(1 2 3) '(4 5 6)) => '((1 4) (2 5) (3 6))
(def list-zip (. args) (apply list-map (cons list args)))

(def vector-push! (x a)
    (x.push a)
    x)

;; ;; (vector-map1 square [1 2]) => (1 4)
(def vector-map1 (f p count result)
    (if (== count p.length)
        result
        (vector-map1 f p (+ count 1) (vector-push! result (f p[count])))))
;; (vector-get-nth-arguments 0 '([1,2] [4,5])) => '(1, 4)
(def vector-get-nth-arguments (n args)
    (if (== args '())
        '()
        (cons (car args)[n]
              (vector-get-nth-arguments n (cdr args)))))

(def vector-map-helper)
(= vector-map-helper (fn (f count result length-of-1st-vector p)
    (if (== count length-of-1st-vector)
        result
        (do (vector-push! result
                (apply f (vector-get-nth-arguments count p)))
                (vector-map-helper f (+ count 1) result length-of-1st-vector p)))))

;; eg (vector-map + [1,2] [3,4]) => [4, 6]
(def vector-map (f p . args)
    (vector-map-helper f 0 [] p.length (cons p args)))

;; vector-zip
;; eg (vector:zip #(1 2) #(3 4)) => [[1 3] [2 4]]
(def vector-zip (. args) (apply vector-map (cons Array args)))

(def array-map vector-map)
(def array-zip vector-zip)

;; ##################### reduce ##################
;; reduce function
;; eg (reduce + '(3 4 5)) => (+ (+ 3 4) 5)
;; (reduce f l)
;; where f has to have two parameters
(def list-reduce (f l :param_num 2)
    (def get_num_element_list (l num) ;; eg '(3 4 5) 2 => '(3 4)
        (if (== num 0)
            '()
            (if (null? l)
                (print "ERROR: reduce function invalid parameters list")
                (cons (car l)
                      (get_num_element_list (cdr l)
                                            (- num 1))))))
    (def cdrn (l num) ;; eg '(3 4 5) 2 => '(5)
        (if (== num 0)
        l
        (cdrn (cdr l) (- num 1))))
    (def reduce_iter (f l param_num_1 acc)
        (if (== l '())
            acc
            (reduce_iter f
                        (cdrn l param_num_1)
                        param_num_1
                        (apply f (cons acc (get_num_element_list l param_num_1))))))
    (if (== l '())
        '()
        (reduce_iter f (cdr l) (- param_num 1) (car l))))

;; #################### curry #####################
;; curry function
;; eg (((curry + 1) 2) 3) => 6
(def list-curry (func . arg)
    (fn (. another-arg)
        (apply func (append arg another-arg))))
