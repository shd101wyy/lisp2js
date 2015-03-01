var x = 12;
var test = function(x) {
    switch (x) {
        case 0:
            return 1;
        case 1:
            2;
            return 3;
        case 12:
            return "Yoo";
        default:
            return null;
    };
};
switch (x) {
    case 0:
        1;
        break;
    default:
        13;
        break;
};
console.log(((function() {
    switch (x) {
        case 0:
            return 1;
        case 12:
            return 2;
    }
})() + 3));