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
  (f (property . args) . rest) `(-> ((get ~f ~property) ~@args) ~@rest))

;; ########################################################
;; ########################################################
;; ########################################################
;;  lisp module
;; ########################################################
;; ########################################################
;; ########################################################
(def lisp_module ()
  (def macro {})
  (def GET_DOT 1)
  (def ARRAY_OBJECT_GET 3)
  (def eval_result "")
  (def global_context null)
  (def recursion_function_name_count 0)

  (fn append (x y)
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
    (loop end end
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
                      (append! output_list "" "") ;; save space
                      (= (get output_list (+ j 2))
                         (get output_list j))
                      (recur end
                             paren_count
                             (loop j (- j 1)
                                   p p
                                   output_list output_list
                                   (do (= (get output_list (+ j 2))
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
						(= (get output_list (+ j 1)) "get")
						(append! output_list
							 (+ "\"" (t.slice 1) "\"")
							 ")"))
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
  ;; now define parser
  (fn parser (l)
      (def parser_get_tag
	   {"'" "quote"
	   "~" "unquote"
	   "~@" "unquote-splice"
	   "`" "quasiquote"})
      (if (== l null) ;; lexer failure
	  null
	
	(loop i (- l.length 1)
	      lists null
	      current_list_pointer null
	      temp null
	      (cond (< i 0)
		    current_list_pointer
		    
		    (== l[i] ")")
		    (recur (- i 1)
			   (cons current_list_pointer lists)
			   null)
		    
		    (== l[i] "(")
		    (cond (&& (!= i 0)
			      (== (get l (- i 1)) "~@")
			      (== (get l (- i 1)) "'")
			      (== (get l (- i 1)) "~")
			      (== (get l (- i 1)) "`"))
			  (recur (- i 2)
				 (cdr lists)
				 (cons (cons (get parser_get_tag (get l (- i 1)))
					     (cons current_list_pointer null))
				       (car lists))
				 lists)
			  
			  else
			  (recur (- i 1)
				 (cdr lists)
				 (cons current_list_pointer (car lists)) ;; append list
				 lists))
		    else
		    (if (&& (!= i 0)
			    (== (get l (- i 1)) "~@")
			    (== (get l (- i 1)) "'")
			    (== (get l (- i 1)) "~")
			    (== (get l (- i 1)) "`"))
			(recur (- i 2)
			       lists
			       (cons (cons (get parser_get_tag (get l (- i 1)))
					   (cons (get l i) null))
				     current_list_pointer)
			       (get l i))
		      (recur (- i 1)
			     lists
			     (cons (get l i)
				   current_list_pointer)
			     (get l i)))
		    ))))

  ;; quote a list
  (fn quote_list (l)
      (cond (== l null)
	    null

	    (instanceof l.first List)
	    (cons "cons"
		  (cons (quote_list l.first)
			(cons (quote_list l.rest)
			      null)))
	    (== l.first ".")
	    (cons "quote"
		  (cons l.rest.first null))

	    else
	    (cons "cons"
		  (cons (cons "quote"
			      (cons l.first
				    null))
			(cons (quote_list l.rest)
			      null)))))

  (fn quasiquote_list (l)
    (cond (== l null)
          null

          (instanceof l.first List)
          (cond (== l.first "unquote")
                (cons "cons"
                      (cons l.rest.first
                            (cons (quasiquote_list  l.rest)
                                  null)))

                (== l.first "unquote-splice")
                (cons "append"
                      (cons l.rest.first
                            (cons (quasiquote_list l.rest)
                                  null)))

                else
                (cons "cons"
                      (cons (quasiquote_list l.first)
                            (cons (quasiquote_list l.rest)
                                  null))))

          (== l.first ".")
          (cons "quote"
                (cons l.rest.first null))

          else
          (cons "cons"
                (cons (cons "quote"
                            (cons l.first null))
                      (cons (quasiquote_list l.rest)
                                             null)))))

  ;; validate variable name
  ;; if one character in that variable name is invalid
  ;; replace it with its char code
  (fn validateName (var_name)
    (loop o ""
          i 0
          (cond (== i var_name.length) ;; first letter is number, add _ ahead
                (if (! (isNaN o[0]))
                  (+ "_" o)
                  o)
                
                else 
                (do (def code (var_name.charCodeAt i))
                    (if (|| (&& (> code 47) ;; numeric (0-9)
                                (< code 58))
                            (&& (> code 64) ;; upper alpha (A-Z)
                                (< code 91))
                            (&& (> code 96) ;; lower alpha (a-z)
                                (< code 123))
                            (== var_name[i] "$")
                            (== var_name[i] "_")
                            (== var_name[i] ".")
                            (== var_name[i] "&")
                            (> code 255)) ;; utf
                      (recur (+ o var_name[i])
                             (+ i 1))
                      (recur (+ o "_$" code "_")
                             (+ i 1)))))))
  
  ;; format parameters
  (fn formatParams (params)
    (loop o "("
          params params
          (cond (== params null) ;; done
                (+ o ")")

                else  ;; ekse
                (do (def p (compiler params.first :param_or_assignment true))
                    (if (&& (== (typeof p)
                                "string")
                            (== p[0] ":"))
                      (recur (+ o (p.slice 1) "=")
                             params.rest)
                      (recur (+ o p (if (!= params.rest null) ", " ""))
                             params.rest))))))

  ;; format key
  ;; eg key is ":a-b-c" ".a-b-c"
  ;; then p is "a-b-c"  "a-b-c"

  (fn formatKey (p)
    (if (&& (== (validateName p)
                p)
            (isNaN p))
      p
      (+ "\"" p "\"")))

  ;; now constructor compiler
  (fn compiler (l
                :is_last_exp null
                :is_recur null
                :need_return_string null
                :param_or_assignment null
                :current_fn_name null)
    (cond (== l null)
          (if need_return_string "return null" "null")

          ;; l is List
          ;; so the exp is like
          ;; (def x 1)
          ;; (def y 2)
          (instanceof l List)
          (cond
            ;; (def x 1)
            ;; (= y 2)
            ;; (def add (a b) (+ a b))
            ;; (set! z 3)            
            (|| (== l.first "def")
                (== l.first "=")
                (== l.first "set!")
                (== l.first "const"))
            (do (def var_name (compiler (car (cdr l))))
                (def var_value (compiler (cond (== (cdr (cdr l)) null)       ;; null 
                                               null
                                               
                                               (!= (cdr (cdr (cdr l))) null) ;; fn 
                                               (cons "fn" (cons (car (cdr (cdr l)))
                                                                (cdr (cdr (cdr l)))))
                                               
                                               else
                                               l.rest.rest.first)
                                         :current_fn_name var_name))
                (def o (+ (cond (== l.first "def") "var"
                                (== l.first "const") "const"
                                else "")
                          var_name
                          " = "
                          var_value
                          " "))
                (if need_return_string
                  (+ o "; return " ;; return that var_name
                     var_name)
                  o))

            ;; array
            (== l.first "Array") ;; array
            (+ (if need_return_string "return [" "[")
               (loop l (cdr l)
                     output ""
                     (if (== l null)
                       output
                       (recur (cdr l)
                              (+ output 
                                 (compiler (car l)
                                           :param_or_assignment true)
                                 (if (== (cdr l) null) "" ", ")))))
               "]")

            ;; object
            (== l.first "Object")
            (+ (if need_return_string "return {" "{")
               (loop l (cdr l)
                     output ""
                     (if (== l null)
                       (+ o "}")
                       (do (def key (compiler l.first :param_or_assignment true))
                           ;; (def value (compiler l.rest.first :param_or_assignment true))
                           (cond
                             ;; {:a 12}
                             ;; {:a :b}
                             (== key[0] ":")
                             (if (&& (!= l.rest null)
                                     ;; (!= l.rest.first[0] ":") ;; this has bug
                                     (!= (get l 'rest 'first 0) ":"))
                               (recur l.rest.rest
                                      (+ o
                                         (formatKey (key.slice 1)) ;; key
                                         ": "
                                         (compiler l.rest.first :param_or_assignment true) ;; value
                                         (if (!= l.rest.rest null) ", " "")))
                               (recur l.rest
                                      (+ o
                                         (key.slice 1)
                                         (if (!= l.rest null) ", " "" ))))

                             ;; key is "abc" like string
                             (|| (== key[0] "'")
                                 (== key[0] "\""))
                             (recur l.rest.rest
                                    (+ o
                                       key ;; key
                                       ": "
                                       (compiler l.rest.first :param_or_assignment true) ;; value
                                       (if (!= l.rest.rest null) ", " "")))

                             else
                             (recur l.rest.rest
                                    (+ o
                                       "["
                                       key ;; key
                                       "]: "
                                       (compiler l.rest.first :param_or_assignment true) ;; value
                                       (if (!= l.rest.rest null) ", " ""))))))))

            ;; x[0].a like exp
            (== l.first GET_DOT) ;; x[0].a
            (do (def k (formatKey (l.rest.first.slice 1)))
                (+ (if need_return_string "return " "")
                   (compiler l.rest.rest.first)
                   (if (== k[0] "\"")
                     (+ "[" k "]")
                     (+ "." k))))

            ;; quote or quasiquote
            (|| (== l.first "quote")
                (== l.first "quasiquote"))
            (cond (instanceof l.rest.first List)
                  (do (def v (compiler (if (== tag "quote")
                                         (quote_list l.rest.first)
                                         (quasiquote_list l.rest.first))))
                      (if need_return_string (+ "return " v) v))

                  (== l.rest null)
                  (if need_return_string "return null" "null")

                  (isNaN l.rest.first) ;; not a number
                  (if need_return_string
                    (+ "return \"" l.rest.first "\"")
                    (+ "\"" l.rest.first "\""))

                  else
                  (if need_return_string (+ "return " l.rest.first) l.rest.first))

	    ;; fn fn*
	    (|| (== l.first "fn")
                (== l.first "fn*"))
            (do (def o (+ (if need_return_string "return " "") ;; o is part ahead (){}
                          (if (== tag "fn") "function" "function*"))) 
                (def o2 "") ;; o2 is (){}
                (def params)
                (def body)
                (if (== (typeof l.rest.first) "string")
                  ;;solve ((function test (){})()) problem
                  (do (= current_fn_name l.rest.first) ;; set recur fn name
                      (= o2 (+ o2 l.rest.first "("))
                      (= params l.rest.rest.first)
                      (= body l.rest.rest.rest))
                  (do (= o2 "(")
                      (= params l.rest.first)
                      (= body l.rest.rest)))
                (= o2 (loop params params
                            o2 o2
                            (do (def p (compiler params.first))
                                (cond
                                  ;; default param
                                  (== p[0] ":") 
                                  (recur params.rest
                                         (+ o2 (p.slice 1) "="))
                                  
                                  ;; es6 rest parameters
                                  (== p "&")
                                  (+ o2 "..." (compiler params.rest.first))
                                  
                                  ;; es6 rest parameters. convert to list
                                  (== p ".")
                                  (do (def p (compiler params.rest.first))
                                      (= body (cons (list "="
                                                          p
                                                          (list "list.apply" "null" p))
                                                    body))
                                      (+ o2 "..." p))

                                  ;; else
                                  else
                                  (recur params.rest
                                         (+ o2 p (if (!= params.rest null) ", " "")))))))
                (def is_recur [(if current_fn_name current_fn_name false)])
                (= o2 (+ o2
                         "){"
                         (lisp_compiler body
                                        :need_return_string true
                                        :is_recur is_recur)
                         "}"))
                (+ o
                   (if (&& (!= is_recur[0] false)
                           (!= is_recur[0] current_fn_name)) ;; is recur
                     is_recur[0]
                     "")
                   o2))

            (== l.first "let")
            null

            (== l.first "cond")
            null

            (== l.first "if")
            null

            (== l.first "do")
            null

            (== l.first "apply")
            null

            (== l.first "new")
            null

            (|| (== l.first "+")
                (== l.first "-")
                (== l.first "*")
                (== l.first "/")
                (== l.first "%")
                (== l.first "==")
                (== l.first "<")
                (== l.first ">")
                (== l.first "!=")
                (== l.first "<=")
                (== l.first ">=")
                (== l.first "&&")
                (== l.first "||")
                (== l.first "&")
                (== l.first "|"))
            null 

            (== l.first "instanceof")
            null

            (== l.first "get")
            null

            (== l.first "try")
            null

            (== l.first "in")
            null

            (== l.first "defmacro")
            null

            else ;; fn
            null 
            
            
            )))
  
  (fn lisp_compiler (l
                     :need_return_string null
                     :eval_$ null
                     :is_recur null)
      )

    ;; (console.log (-> (parser (lexer "(x.add[(+ 3 4)].Hi 12)")) ('toString)))
    null)


  (lisp_module)
