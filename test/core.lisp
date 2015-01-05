;; this file is refered from https://github.com/shd101wyy/WalleyLanguage walley_core.wa
(def lisp2js
    {
        :author 'Yiyi-Wang
        "core-version" "0.0.1"
    })

(def print (x) (console.log (x.toString)))
(def null? (x) (== x '()))
(def not (a) (if a () 1))

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
(def x [1 2 3 4 5 6])
(print (x.toList))
