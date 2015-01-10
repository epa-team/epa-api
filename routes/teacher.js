var express = require('express');
var router = express.Router();
var mongo = require('mongodb');

var Server = mongo.Server,
Db = mongo.Db,
BSON = mongo.BSONPure;

/*
* GET studentlist.
*/
router.get('/teachers', function(req, res) {
    var db = req.db;
    db.collection('teacherList',function(err, collection) {
        collection.find().toArray(function(err, items) {
            var allTeachers = {
                teachers:items
            };
            res.send(allTeachers);
        });
    });
});
router.get('/teachers/:id', function(req, res) {
    var db = req.db;
    var teacherId = BSON.ObjectID.createFromHexString(req.params.id);
    console.log('teacherId',teacherId);
    db.collection('teacherList',function(err, collection) {
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
router.post('/teachers', function(req, res) {
    var teacher = req.body.teacher;
    var db = req.db;
    console.log('Adding teacher: ' + JSON.stringify(teacher));
    console.log('Adding teacher: ' + JSON.stringify(req.body.teacher));
    db.collection('teacherList', function(err, collection) {
        collection.insert(teacher, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred ' + err});
            } else {
                var record = result[0];
                res.json({teacher:record});
            }
        });
    });
});

router.put('/teachers/:id' , function(req, res) {
    var db = req.db;
    var student =req.db;
    var studentId = req.params.id;
    db.collection('teacherList').update(
    {
        _id: req.collection.id(req.params.id)
    },
    {
        $set:req.body
    },
    {
        safe:true,
        multi:false
    },
    function(e, result) {
        if (e) return next(e)
        res.send((result===1) ? {msg:'success'} : {msg:'error'});
    });

});
/*
* DELETE to deletestudent.
*/
router.delete('/teachers/:id', function(req, res) {
    var db = req.db;
    var teacherToDelete = req.params.id;
    db.collection('teacherList').removeById(teacherToDelete, function(err, result) {
        if (err) {
            res.send({'error':'An error has occurred - ' + err});
        } else {
            console.log('' + result + ' document(s) deleted');
            res.json({});
        }
    });
});
module.exports = router;
