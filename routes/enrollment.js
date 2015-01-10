var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

/*
* GET studentlist.
*/
router.get('/enrollments', function(req, res) {
    var db = req.db;
    var value = {};
    db.collection('enrollmentList', function(err, collection) {
        collection.find().toArray(function(err, enrollments) {

            value['enrollments'] = enrollments;
            db.collection('courseList', function(err, collection){
                collection.find().toArray(function(err, courses) {
                    value['courses'] = courses;
                    db.collection('teacherList', function(err, collection) {
                        collection.find().toArray(function(err, teachers) {
                            value['teachers'] = teachers;
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
router.post('/enrollments', function(req, res) {
    var enrollment = req.body.enrollment;
    var db = req.db;
    console.log('Adding location: ' + JSON.stringify(enrollment));
    console.log('Adding location: ' + JSON.stringify(req.body.enrollment));
    db.collection('enrollmentList', function(err, collection) {
        collection.insert(enrollment, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                var record = result[0];
                res.json({enrollment:record});
            }
        });
    });

});

router.put('/enrollments/:id' , function(req, res) {
    var db = req.db;
    var id = req.params.id;
    var enrollment = req.body.enrollment;

    console.log(req.body);
    console.log('Updating enrollment with id [' + id + ']');
    console.log('enrollment payload = ' + JSON.stringify(enrollment));

    db.collection('enrollmentList', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, enrollment, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating enrollment: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                enrollment._id = id;
                res.json({enrollment:enrollment});
            }
        });
    });
});


/*
* DELETE to deletestudent.
*/
router.delete('/enrollments/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    console.log('Deleting location: ' + id);
    db.collection('enrollmentList', function(err, collection) {
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
