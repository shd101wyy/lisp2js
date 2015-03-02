(class Test
    :constructor (fn (x)
                    (= this.x x))
    :showX (fn ()
                (console.log this.x)))

(class A
    :constructor (fn (x)
                    (= this.x x))
    :showX (fn ()
                (console.log "This is A")
                (console.log this.x)))

(class B  extends A
    :constructor (fn (x y)
                    (= this.y 12)
                    (super x))
    :showX (fn ()
                (console.log "This is B")
                (super.showX)
                (console.log (+ "Y: " this.y))))

(def x (new B 1 2))
(x.showX)
