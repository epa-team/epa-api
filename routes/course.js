var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

/*
* GET studentlist.
*/
router.get('/courses', function(req, res) {
    var db = req.db;
    var value = {};
    db.collection('courseList', function(err, collection) {
        collection.find().toArray(function(err, courses) {
            value['courses'] = courses;
            console.log(value);
            db.collection('teacherList', function(err, collection) {
                collection.find().toArray(function(err, teachers) {
                    value['teachers'] = teachers;
                    db.collection('subjectList', function(err, collection) {
                        collection.find().toArray(function(err, subjects){
                            value['subjects'] = subjects
                            res.json(value);
                        });
                    });
                });
            });
        });
    });
});

/*
* POST to addstudent.
*/
router.post('/courses', function(req, res) {
    var course = req.body.course;
    var db = req.db;
    console.log('Adding location: ' + JSON.stringify(course));
    console.log('Adding location: ' + JSON.stringify(req.body.course));
    db.collection('courseList', function(err, collection) {
        collection.insert(course, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                var record = result[0];
                res.json({course:record});
            }
        });
    });

});

router.put('/courses/:id' , function(req, res) {
    var db = req.db;
    var id = req.params.id;
    var course = req.body.course;

    console.log(req.body);
    console.log('Updating course with id [' + id + ']');
    console.log('course payload = ' + JSON.stringify(course));

    db.collection('courseList', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, course, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating course: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                course._id = id;
                res.json({course:course});
            }
        });
    });
});


/*
* DELETE to deletestudent.
*/
router.delete('/courses/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    console.log('Deleting location: ' + id);
    db.collection('courseList', function(err, collection) {
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
