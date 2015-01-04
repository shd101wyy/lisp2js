lisp2js
=======

Simple Lisp that compiles to JavaScript (ECMAScripten 6)

(def x 12)           =>           var x = 12

(= x 15)             =>           x = 15

(def x [1 2 3])      =>           var x = [1 2 3]

(def x {"a" 12, "b" 13, c 14}) => var x = {["a"]:12, ["b"]:13, ["c"]:14}

(def add (x y)       =>           var add = (x, y)=>{return x + y}
    (+ x y))

(def abs (x)         =>           var abs = (x)=>{
    (if (> x 0)                       return ((x > 0) ? (x) : (-x))
        x                         }
        (- x)))

(def [x, y, z] = [1, 2, 3])    => var [x, y, z] = [1, 2, 3]


(def add (:a 12 :b 13)         => var add = function(a=12, b=13){
    (+ a b))                                    return a + b  
                                            }

(add :a 12, 13)                 => add(a=12, 13)

(console.log 12)                => console.log(12)

(= x.a.b     13)                => x.a.b = 13

(= x[a] 13)                     => x [a] = 13

(Math.pow 12 2)                 => Math.pow(12, 2)

(-> $ (.ajax {})                => $.ajax({}).success(function(){}).done(function(){})
      (.success (fn () ...))
      (.done (fn () ...)))
