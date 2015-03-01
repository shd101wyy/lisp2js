var x = 12;
var test = function(x) {
    switch (x) {
        case 0:
            1;
            break;
        case 1:
            2;
            3;
            break;
        case 12:
            "Yoo";
            break;
    };
    return 123;
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
if ((1 ? 2 : 3)) {
    2
} else {
    3
};
var test = function(x) {
    switch (x) {
        case "apple":
            return "This is apple";
        case "orange":
            return "This is orange";
        default:
            return "This is nothing";
    };
};