/*
* GET studentlist page.
*/

exports.studentList = function(db) {
    return function(req, res) {
        db.collection('studentList').find().toArray(function (err, items) {
            res.json(items);
        })
    }
};

/*
* POST to addstudent.
*/

exports.addStudent = function(db) {
    return function(req, res) {
        db.collection('studentList').insert(req.body, function(err, result){
            res.send(
                (err === null) ? { msg: '' } : { msg: err }
            );
        });
    }
};

/*
* DELETE to deletestudent.
*/

exports.deleteStudent = function(db) {
    return function(req, res) {
        var studentToDelete = req.params.id;
        db.collection('studentList').removeById(studentToDelete, function(err, result) {
            res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
        });
    }
};
