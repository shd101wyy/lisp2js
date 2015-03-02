(class Test
    :constructor (fn (x)
                    (= this.x x))
    :showX (fn ()
                (console.log this.x)))

(class A
    :constructor (fn (x)
                    (= this.x x)))

(class B  extends A
    :constructor (fn (x y)
                    (= this.y 12)
                    (super this.y)))
