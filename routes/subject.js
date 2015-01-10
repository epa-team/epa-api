var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

/*
* GET studentlist.
*/
router.get('/subjects', function(req, res) {
    var db = req.db;
    db.collection('subjectList', function(err, collection) {
        collection.find().toArray(function(err, items) {
            var allLocations = {
                subjects:items
            };
            res.send(allLocations);
        });
    });
});

/*
* POST to addstudent.
*/
router.post('/subjects', function(req, res) {
    var subject = req.body.subject;
    var db = req.db;
    console.log('Adding location: ' + JSON.stringify(subject));
    console.log('Adding location: ' + JSON.stringify(req.body.subject));
    db.collection('subjectList', function(err, collection) {
        collection.insert(subject, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                var record = result[0];
                res.json({subject:record});
            }
        });
    });

});

router.put('/subjects/:id' , function(req, res) {
    var db = req.db;
    var id = req.params.id;
    var subject = req.body.subject;

    console.log(req.body);
    console.log('Updating subject with id [' + id + ']');
    console.log('subject payload = ' + JSON.stringify(subject));

    db.collection('subjectList', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, subject, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating subject: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                subject._id = id;
                res.json({subject:subject});
            }
        });
    });
});


/*
* DELETE to deletestudent.
*/
router.delete('/subjects/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    console.log('Deleting location: ' + id);
    db.collection('subjectList', function(err, collection) {
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
