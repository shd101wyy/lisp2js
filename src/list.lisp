;;
;; Simple list for Functional Programming
;; Author: Yiyi Wang
;; 2014/12/13
;;
;; It is not allowed to use macro in this file, otherwise bug will occur.

;; Construct List data structure
(class List
       :constructor (fn [first rest]
                      (set! this.first first)
                      (set! this.rest rest))
       
       ;;    ###
       ;;    get length of list
       ;;    eg:
       ;;    x = list(1, 2, 3)
       ;;    x.length() => 3
       ;;    ###
       :length (fn []
                 (defn list_length [l acc]
                   (if (= l null)
                     acc
                     (list_length l.rest (+ acc 1))))
                 (list_length this 0))

       ;; list to string
       :toString (fn []
                   (defn to_string [l output]
                     (cond
                       (= l null) (+ output ")")
                       (instanceof l List) (to_string l.rest
                                                      (+ output
                                                         (if (= l.first null)
                                                           "()"
                                                           (l.first.toString))
                                                         (if (= l.rest null)
                                                           ""
                                                           ",")))
                       ;; here :else has bug
                       else (+ (output.slice 0 -2)
                                " . "
                                (l.toString)
                                ")")))
                   (to_string this "("))

       ;;    ###
       ;;    list reverse
       ;;    eg:
       ;;      x = list(1, 2, 3)
       ;;      x.reverse() => (3, 2, 1)
       ;;    ###
       :reverse (fn []
                  (defn list_reverse [l output]
                    (cond
                      (instanceof l List) (list_reverse l.rest (cons l.first output))
                      (= l null) output
                      else      (cons l output)))
                  (list_reverse this null))

       
       ;;  ###
       ;;  list slice
       ;;  eg:
       ;;    x = list(1, 2, 3, 4, 5)
       ;;    x.slice(2) => list(3, 4, 5)
       ;;    x.slice(3, 5) => list(4, 5)
       ;;    x.slice(-2) => list(4, 5)
       ;;  ###
       :slice (fn [start :end null]
                (if (= end null)
                  (do (if (< start 0)
                        (set! start (+ (this.length) start)))
                      (defn slice1 [l i]
                        (if (= i 0)
                          l
                          slice1(l.rest (- i 1))))
                      (slice1 this start))
                  (do (def neg (or (< start 0) (< end 0)))
                      (if neg (do (def length (this.length))
                                  (set! start (if (< start 0)
                                                (+ length start)
                                                start))
                                  (set! end   (if (< end 0)
                                                (+ length end)
                                                end))))
                      (defn slice2 [l i j]
                        (if (= i 0)
                          (if (or (= j 0) (= l null))
                            null
                            (cons l.first (slice2 l.rest i (- j 1))))
                          (slice2 l.rest (- i 1) j)))
                      (slice2 this start (- end start)))))
       
       ;; ###
       ;; list ref
       ;; eg:
       ;;   x = list(1, 2, 3, 4)
       ;;   x.ref(0) => 1
       ;; ###
       :ref (fn [i]
              (defn ref [l i]
                (cond
                  (= l null) null
                  (= i 0) l.first
                  else (ref l.rest (- i 1))))
              (ref this (if (< i 0) (+ (this.length) i) i)))
       
       ;;    ###
       ;;    list append
       ;;    eg:
       ;;      x = list(1, 2, 3, 4)
       ;;      x.append(5) => (1, 2, 3, 4, 5)
       ;;      x.append(7, 8) => (1, 2, 3, 4, 7, 8)
       ;;    ###
       ;; here [. o] has bug
       ;; :append (fn [. o]
       ;;   (defn append [l o]
       ;;     (if (= l null)
       ;;       o
       ;;       (cons l.first
       ;;             (append l.rest o))))
       ;;   (append this o))
       
       ;; toArray
       ;; ###
       ;; list toArray
       ;; eg:
       ;;    x = list(1, 2, 3)
       ;;    x.toArray() => [1, 2, 3]
       ;; ###
       :toArray (fn []
                  (def output [])
                  (defn to_array [l]
                    (if (= l null)
                      output
                      (do (output.push l.first)
                          (to_array l.rest))))
                  (to_array this))
       
       ;; forEach
       ;;  ###
       ;;  list forEach
       ;;  eg:
       ;;    x = list(1, 2, 3)
       ;;    x.forEach(i => console.log(i)) => print 1, 2, 3
       ;;  ###
       :forEach (fn [func]
                  (defn iter [l]
                    (if (= l null)
                      null
                      (do (func l.first)
                          (iter l.rest))))
                  (iter this))
       
       ;; :foreach  List.prototype.forEach
       
       ;; map
       ;;  ###
       ;;  list map
       ;;  eg:
       ;;    x = list(1, 2, 3)
       ;;    x.map(i=>i*2) => (2, 4, 6)
       ;;  ###
       :map (fn [func]
              (defn iter [l]
                (if (= l null)
                  null
                  (cons (func l.first)
                        (iter l.rest))))
              (iter this))
       
       ;; filter
       ;;  ###
       ;;  list filter
       ;;  eg:
       ;;    x = list(1, 2, 3, 4)
       ;;    x.filter(i => i > 2)  => (3, 4)
       ;;  ###
       :filter (fn [func]
                 (defn iter [l]
                   (if (= l null)
                     null
                     (if (func l.first)
                       (cons l.first (iter l.rest))
                       (iter l.rest))))
                 (iter this))
       
       )

;; cons
;;  ###
;;  cons two elements.  same as lisp
;;  eg:
;;    x = cons(3, 4)
;;    y = cons(3, cons(4, null))
;;  ###
(defn cons [a b] (new List a b))

;; car
;; get first element of list
(defn car [l] l.first)

;; cdr
;; get rest elements of list
(defn cdr [l] l.rest)

;;  list
;;  ###
;;  construct list. same as lisp
;;  eg:
;;    x = list(1, 2, 3, 4)
;;  ###
(defn list [& a]
  (defn create_list [a i]
    (if (= i a.length)
      '()
      (cons a[i]
            (create_list a (+ i 1)))))
  (create_list a 0))

(if (not (= (typeof module) "undefined"))
  (do (set! module.exports.List List)
      (set! module.exports.list list)
      (set! module.exports.cons cons)
      (set! module.exports.car car)
      (set! module.exports.cdr cdr)))
  
;; ===================================================================================================
;; =============================== DONE Define List Object ===========================================
;; ===================================================================================================
