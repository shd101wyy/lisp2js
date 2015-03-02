var Test = function(x) {
    this.x = x;
    return this.x;
};
Test.prototype = {
    showX: function() {
        return console.log(this.x);
    }
};