var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

/*
* GET studentlist.
*/
router.get('/students', function(req, res) {
    var db = req.db;
    db.collection('studentList', function(err, collection) {
        collection.find().toArray(function(err, items) {
            var allLocations = {
                students:items
            };
            res.send(allLocations);
        });
    });
});

/*
* POST to addstudent.
*/
router.post('/students', function(req, res) {
    var student = req.body.student;
    var db = req.db;
    console.log('Adding location: ' + JSON.stringify(student));
    console.log('Adding location: ' + JSON.stringify(req.body.student));
    db.collection('studentList', function(err, collection) {
        collection.insert(student, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                var record = result[0];
                res.json({student:record});
            }
        });
    });

});

router.put('/students/:id' , function(req, res) {
    var db = req.db;
    var id = req.params.id;
    var student = req.body.student;

    console.log(req.body);
    console.log('Updating student with id [' + id + ']');
    console.log('student payload = ' + JSON.stringify(student));

    db.collection('studentList', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, student, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating student: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                student._id = id;
                res.json({student:student});
            }
        });
    });
});


/*
* DELETE to deletestudent.
*/
router.delete('/students/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    console.log('Deleting location: ' + id);
    db.collection('studentList', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.json({});
            }
        });
    });

});

module.exports = router;
