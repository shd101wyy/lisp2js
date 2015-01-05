;; this file is refered from https://github.com/shd101wyy/WalleyLanguage walley_core.wa

(def lisp2js
    {
        :author 'Yiyi-Wang
        "core-version" "0.0.1"
    })

(def print (x) (console.log (x.toString)))
(def null? (x) (== x '()))
(def not (a) (if a () 1))

(defmacro cond
    () ()
    (#else body) body
    (#else body . rest) (print "ERROR: cond invalid statements.\n")
    (test body) `(if ~test ~body '())
    (test body . rest) `(if ~test ~body (cond ~@rest))
    )
(def b 12)
(cond 1 2 3 b)
(console.log "Here")
