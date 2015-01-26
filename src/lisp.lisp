;;
;; Simple list for Functional Programming
;; Author: Yiyi Wang
;; 2014/12/13
;; assume car cdr list List those 4 functions already exist as global.
;;
;; iteratre over object
(def obj_foreach (obj func)
    (def keys (Object.keys obj))
    ((fn (count)
        (if (== count keys.length)
            '()   ;; done
            (do (func keys[count]
                      obj[keys[count]])
                (recur (+ count 1))))) 0))

;; foreach
(def foreach (o func)
    (cond (== o.constructor Object)  (obj_foreach o func) ;; it is object
          else (do (o.forEach func)
                    '())))
;; map
(def map (o func)
    (o.map func))

;; len
(def len (o)
    (cond (== o.constructor Object) (Object.keys o).length
          (== (typeof o.length) "function") (o.length)
          else o.length))

;; NON-destructive
;; append
(def append (o & args)
    (cond   (== o.constructor Array)    (do (def x (o.slice))
                                            (x.push.apply x args)
                                            x)
            else (o.append.apply o args)))

;; destructive
;; append!
(def append! (o & args)
    (cond   (== o.constructor Array) (do (o.push.apply o args)
                                        o)
            else (o.append.apply o args)))

;; filter
(def filter (o func)
    (o.filter func))

(def null? (o) (== o '()))

;; loop macro
;; eg
;; (loop n 10 acc 1
;;     (if (== n 0)
;;         acc
;;         (recur (- n 1) (* acc 1))))
;; =>
;; ((fn (n acc) (if (= n 0) acc (recur (- n 1) (* acc 1)))) n 0)
(def parse-loop (args)
    (def parse-loop-helper (a var-names var-vals)
        (cond (null? a) (console.log "ERROR: loop invalid statement: " args "\n")
              (null? (cdr a)) [(car a), var-names, var-vals]
              else (parse-loop-helper (cdr (cdr a))
                                      (cons (car a) var-names)
                                      (cons (car (cdr a)) var-vals))))
    (def parse-result (parse-loop-helper args '() '()))
    (def body parse-result[0])
    (def var-names (parse-result[1].reverse))
    (def var-vals (parse-result[2].reverse))
    (cons `(fn ~var-names ~body) var-vals))

(defmacro loop
    (. args) (parse-loop args))

;; simple Lisp to JavaScript compiler
(def node_environment null)
(def vm null)
(if (!= (typeof module) "undefined") ;; nodejs
    (do (= vm (require "vm")
        (= node_environment true))))


;; when macro
;; (when (== 1 1) (console.log "Hi") 12)
;; => (if (== 1 1) (do (console.log "Hi") 12))
;;
(defmacro when (test . body)
    `(if ~test (do ~@body)))


input_string[i]

;; ########################################################
;; ########################################################
;; ########################################################
;;  lisp module
;; ########################################################
;; ########################################################
;; ########################################################
(def lisp_module ()
    (def lexer)
    (def parser)
    (def compiler)
    (def lisp_compiler)
    (def macro {})
    (def GET_DOT 1)
    (def ARRAY_OBJECT_GET 3)
    (def eval_result "")
    (def global_context null)
    (def recursion_function_name_count 0)
    (def append (x y)
        (if (== x null)
            (if (|| (instanceof y List)
                    (== y null))
                y
                (cons y null))
            (cons   (car x)
                    (append (cdr x y)))))

    (if node_environment ;; run under nodejs env
        (= global_context
            (vm.createContext { :cons cons
                                :car car
                                :cdr cdr
                                :list list
                                :List List
                                :append append
                                :console console}))
        (= window.append append))

    ;; lexer
    (def lexer (input_string)
        (def output_list [])
        (def paren_count 0)
        (def getIndexOfValidStr null)

        (loop i 0
            (cond
                (== input_string[i] "(")
                    (do (= paren_count (+ paren_count 1))
                        (output_list.push "("))
                (== input_string[i] "[")
                    (do null)
                ))
        )

    null)
