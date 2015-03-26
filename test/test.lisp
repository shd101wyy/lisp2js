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

(def y (class X
            :constructor (fn (x) (= this.x x))))


(class Animal
    :constructor (fn (age)                ;; define constructor
                    (= this.age age))
    :showAge (fn ()
                (console.log "Called from Animal")
                (console.log this.age)))
(class Dog extends Animal
    :constructor (fn (age)                ;; define constructor
                    (super age))          ;; call superclass constructor
    :showAge (fn ()
                (console.log "Called from Dog")
                (super.showAge))          ;; call superclass method
    :bark (fn ()
            (console.log "Bark!")))

(def dog (new Dog 5))
(dog.showAge)
(dog.bark)


(def add (:a 12 :b 13) (+ a b))
