$.post("test.php").done(function() {
    return "done";
}).fail(function() {
    return "fail";
}).test({
    x: 1,
    y: 2
}).done();
x.test().next().done();