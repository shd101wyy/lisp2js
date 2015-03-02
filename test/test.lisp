(class Test
    :constructor (fn (x)
                    (= this.x x))
    :showX (fn ()
                (console.log this.x)))
