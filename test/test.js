{
    let x = 1;
    let y = 2;
    x = (x + y);
    let z = 4;
    (x + y + z)
};
(((function() {
    let x = 1;
    let y = 2;
    return (x - y)
})()) + 3);
var test = function() {
    {
        let x = 1;
        let y = 2;
        return (x + y)
    };
};