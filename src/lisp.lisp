;;
;; Simple list for Functional Programming
;; Author: Yiyi Wang
;; 2014/12/13
;; assume car cdr list List those 4 functions already exist as global.
;;

(def #t true)
(def #f false)
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
  ;;(console.log ((cons `(fn ~var-names ~body) var-vals).toString))
  (cons `(fn ~var-names ~body) var-vals)
  )

(defmacro loop
  (. args) (parse-loop args))

;; simple Lisp to JavaScript compiler
(def node_environment null)
(def vm null)
(if (!= (typeof module) "undefined") ;; nodejs
  (do (= vm (require "vm"))
      (= node_environment true)))


;; when macro
;; (when (== 1 1) (console.log "Hi") 12)
;; => (if (== 1 1) (do (console.log "Hi") 12))
;;
(defmacro when (test . body)
  `(if ~test (do ~@body)))


;; series actions
;; like js, ajax({}).success(function(){}).fail(function(){})
;; eg
;;       (-> (ajax {:data {:x 12}})
;;           (:success (fn (data) (print "Success")))
;;           (:fail)   (fn (data) (print "Fail")) )
;;

(defmacro ->
  (f (property . args))  `((get ~f ~property) ~@args)
  (f (property . args) . rest) `(-> ((get ~f ~property) ~@args) ~@rest)
  )

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

  (fn getIndexOfValidStar (input_string end)
    (loop i end
          (if (|| (== end input_string.length)
                  (== input_string[end] " ")
                  (== input_string[end] "\n")
                  (== input_string[end] "\t")
                  (== input_string[end] ",")
                  (== input_string[end] ")")
                  (== input_string[end] "(")
                  (== input_string[end] "]")
                  (== input_string[end] "[")
                  (== input_string[end] "}")
                  (== input_string[end] "{")
                  (== input_string[end] "\"")
                  (== input_string[end] "\'")
                  (== input_string[end] "`")
                  (== input_string[end] "~")
                  (== input_string[end] ";")
                  (== input_string[end] ":")
                  (== input_string[end] "."))
            end
            (recur (+ end 1)))))
  ;; lexer
  (fn lexer (input_string)
    (loop i 0
          paren_count 0
          output_list []
          (cond
            ;; reach the end of input_string
            (>= i input_string.length) ;; done
            (if (== paren_count 0)
              output_list
              null) ;; paren doesn't match

            ;; (
            (== input_string[i] "(")
            (recur  (+ i 1)
                    (+ paren_count 1)
                    (append! output_list "("))
            ;; [
            (== input_string[i] "[")
            (cond
              ;; x[0] x[1] (test)[0]
              (&& (!= i 0)
                  (!= (get input_string (- i 1)) " ")
                  (!= (get input_string (- i 1)) "\n")
                  (!= (get input_string (- i 1)) "\t")
                  (!= (get input_string (- i 1))  "\'")
                  (!= (get input_string (- i 1))  "`")
                  (!= (get input_string (- i 1))  "~")
                  (!= (get input_string (- i 1))  "(")
                  (!= (get input_string (- i 1))  "{")
                  (!= (get input_string (- i 1))  "["))
              (do  (def j (- output_list.length 1))
                   (def p (if (== output_list[j] ")") 1 0))
                   (if (== p 0)   ;; x[0]
                     (recur (+ i 1)
                            (+ paren_count 1)
                            (do (append! output_list "get" output_list[j])
                                (= output_list[j] "(")
                                output_list))
                     ;; (something-here)[0]
                     (recur (+ i 1)
                            (+ paren_count 1)
                            (do (append! output_list "" "") ;; save space
                                (= (get output_list (+ j 2)) output_list[j])
                                (loop j (- j 1)
                                      p p
                                      output_list output_list
                                      (do (= (get output_list (+ j 2)) ;; shift
                                             (get output_list j))
                                          (cond
                                            ;; meet ")"
                                            (== output_list[j] ")")
                                            (recur (- j 1)
                                                   (+ p 1)
                                                   output_list)
                                            ;; meet "("
                                            (== output_list[j] "(")
                                            (if (== (- p 1) 0) ;; p is 0
                                              (do (= (get output_list j) "(")
                                                  (= (get output_list (+ j 1)) "get")
                                                  output_list)
                                              (recur (- j 1)
                                                     (- p 1)
                                                     output_list))
                                            
                                            ;; else
                                            else
                                            (recur (- j 1)
                                                   p
                                                   output_list)
                                            )))))))
              else
              (recur (+ i 1)
                     (+ paren_count 1)
                     (append! output_list "(" "Array")))

            ;; {
            (== input_string[i] "{")
            (recur  (+ i 1)
                    (+ paren_count 1)
                    (append! output_list "(" "Object"))

            ;; ) } ]
            (|| (== input_string[i] ")")
                (== input_string[i] "}")
                (== input_string[i] "]"))
            (recur  (+ i 1)
                    (- paren_count 1)
                    (append! output_list ")"))

            ;; ignore those characters
            (|| (== input_string[i] " ")
                (== input_string[i] "\n")
                (== input_string[i] "\t")
                (== input_string[i] ","))
            (recur  (+ i 1)
                    paren_count
                    output_list)

            ;; ~@
            (&& (== input_string[i] "~")
                (!= i input_string.length)
                (== (get input_string (+ i 1)) "@"))
            (recur (+ i 2)
                   paren_count
                   (append! output_list "~@"))

            ;; ` ~ '
            (|| (== input_string[i] "`")
                (== input_string[i] "~")
                (== input_string[i] "'"))
            (recur  (+ i 1)
                    paren_count
                    (append! output_list input_string[i]))

            ;; comment
            (== input_string[i] ";") ;; comment
            (recur (loop j i
                         (if (|| (== j input_string.length)
                                 (== input_string[j] "\n"))
                           j
                           (recur (+ j 1))))
                   paren_count
                   output_list)

            ;; string
            (== input_string[i] "\"")
            (do
              (def end
                (loop a (+ i 1)
                      (cond   (== a input_string.length)
                              a
                              (== input_string[a] "\\")
                              (recur (+ a 2))
                              (== input_string[a] "\"")
                              a
                              else
                              (recur (+ a 1))
                              )))
              (recur  (+ end 1)
                      paren_count
                      (append! output_list (input_string.slice i (+ end 1)))))
            ;; symbol
            else
            (do (def end (getIndexOfValidStar input_string (+ i 1)))
                (def t (input_string.slice i end))
                (cond
                  ;; exp like [0].x
                  (&& (== t[0] ".")
                      (== (get output_list (- output_list.length 1))
                          ")"))
                  (do (def p 1)
                      (def j (- output_list.length 1))
                      (append! output_list "" "" "") ;; save space
                      (= (get output_list (+ j 3))
                         (get output_list j))
                      (recur end
                             paren_count
                             (loop j (- j 1)
                                   p p
                                   output_list output_list
                                   (do (= (get output_list (+ j 3))
					  (get output_list j))
                                       (cond
                                        ;; meet )
                                        (== output_list[j] ")")
					(recur (- j 1)
                                               (+ p 1)
					       output_list)
					
					;; meet (
					(== output_list[j] "(")
					(if (== (- p 1) 0)
					    (do (= (get output_list j) "(")
						(= (get output_list (+ j 1)) GET_DOT)
						(= (get output_list (+ j 2)) t)
						(append! output_list ")"))
					  (recur (- j 1)
						 (- p 1)
						 output_list))
					;; else
					else
					(recur (- j 1)
					       p
					       output_list)
					)))))
		  
                  ;; a.b
                  (&& (== t[0] ".")
                      (> i 0)
                      (!= (get input_string (- i 1)) " ")
                      (!= (get input_string (- i 1)) "\t")
                      (!= (get input_string (- i 1)) "\n")
                      (!= (get input_string (- i 1)) "{")
                      (!= (get input_string (- i 1)) "(")
                      (!= (get input_string (- i 1)) "}")
                      (!= (get input_string (- i 1)) ")"))
                  (recur end
                         paren_count
                         (do
			  (def last (get output_list (- output_list.length 1)))
			  (= (get output_list (- output_list.length 1)) "(")
			  (append! output_list
				   "get"
				   last
				   (+ "\"" (t.slice 1) "\"")
				   ")")))
                  ;; "abc".length
                  (&& (== t[0] ".")
                      (== (get input_string (- i 1))
                          "\""))
                  (recur end
                         paren_count
                         (do (= (get output_list (- output_list.length 1))
                                (+ (get output_list (- output_list.length 1))
                                   t))
                             output_list))
                  

                  ;; else
                  else
                  (recur end
                         paren_count
			 (append! output_list t))
		  )))))
  
  null)
