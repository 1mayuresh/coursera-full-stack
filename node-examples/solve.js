var quad = require('./quadratic');
var prompt = require('prompt');

prompt.get(['a', 'b', 'c'], function(err, result) {
    if (err) {
        return onErr(err);
    }
    console.log('Command-line input received:');
    console.log('a:' + result.a);
    console.log('b:' + result.b);
    console.log('c:' + result.c);

    quad(parseInt(result.a), parseInt(result.b), parseInt(result.c), function(err, quadsolve) {
        if (err) {
            console.log('Error: ', err);
        } else {
            console.log("roots are " + quadsolve.root1() + "  " + quadsolve.root2());
        }
    });
});
