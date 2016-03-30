var mongoose = require('mongoose'),
    assert = require('assert');

var Leaders = require('./models/leadership');

// Connection URL
var url = 'mongodb://localhost:27017/conFusion';
mongoose.connect(url);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to server");

    // create a new leader
    var newLeader = Leaders({
        "name": "Peter Pan",
        "image": "images/alberto.png",
        "designation": "Chief Epicurious Officer",
        "abbr": "CEO",
        "description": "Our CEO, Peter, . . ."
    });

    // save the leader
    newLeader.save(function (err) {
        if (err) throw err;
        console.log('Leader created!');

        // get all the leader
        Leaders.find({}, function (err, leaders) {
            if (err) throw err;

            // object of all the users
            console.log(leaders);
            db.collection('leadership').drop(function () {
                db.close();
            });
        });
    });
});
