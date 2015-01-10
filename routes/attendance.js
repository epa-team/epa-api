var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

/*
* GET studentlist.
*/
router.get('/attendances', function(req, res) {
    var db = req.db;
    var value = {};
    db.collection('attendanceList',function(err, collection) {
        collection.find().toArray(function(err, attendances) {
            value['attendances'] = attendances;
            db.collection('teacherList', function(err, collection) {
                collection.find().toArray(function(err, teachers) {
                    value['teachers'] = teachers;
                    db.collection('courseList', function(err, collection) {
                        collection.find().toArray(function(err, courses) {
                            value['courses'] = courses;
                            res.send(value);
                        });
                    });
                });
            });
        });
    });
});
router.get('/attendances/:id', function(req, res) {
    var db = req.db;
    var teacherId = BSON.ObjectID.createFromHexString(req.params.id);
    console.log('teacherId',teacherId);
    db.collection('attendanceList',function(err, collection) {
        console.log('teacherId2',teacherId);
        collection.findOne({_id: teacherId}, function(err, teacher) {
            console.log(err);
            console.log(teacher);
            res.send(teacher);
        });
    });
});

/*
* POST to addstudent.
*/
router.post('/attendances', function(req, res) {
    var attendance = req.body.attendance;
    var db = req.db;
    console.log('Adding location: ' + JSON.stringify(attendance));
    console.log('Adding location: ' + JSON.stringify(req.body.attendance));
    db.collection('attendanceList', function(err, collection) {
        collection.insert(attendance, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                var record = result[0];
                res.json({attendance:record});
            }
        });
    });
});

router.put('/attendances/:id' , function(req, res) {
    var db = req.db;
    var id = req.params.id;
    var attendance = req.body.attendance;

    console.log(req.body);
    console.log('Updating attendance with id [' + id + ']');
    console.log('attendance payload = ' + JSON.stringify(attendance));

    db.collection('attendanceList', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, attendance, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating attendance: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                attendance._id = id;
                res.json({attendance:attendance});
            }
        });
    });

});
/*
* DELETE to deletestudent.
*/
router.delete('/attendances/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    console.log('Deleting location: ' + id);
    db.collection('attendanceList', function(err, collection) {
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
