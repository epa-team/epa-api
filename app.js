var express = require('express');
var compress = require('compression');
var logger = require('morgan');
var bodyParser = require('body-parser');

// Database connection start //
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/colegioEPA", {native_parser:true});
// Database connection end //

/* rest classes Start*/
var routes = require('./routes/index');
    student = require('./routes/student'),
    subject = require('./routes/subject'),
    teacher = require('./routes/teacher'),
    course = require('./routes/course'),
    enrollment = require('./routes/enrollment'),
    attendance = require('./routes/attendance'),

app = express();
/* rest classes End*/

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compress());

app.all('/*', function(req, res, next) {
    // CORS headers
    res.header("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    // Set custom headers for CORS
    res.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key,session_id');
    if (req.method == 'OPTIONS') {
        res.status(200).end();
    } else {
        next();
    }
});

// Make our db accessible to our router
app.use(function(req,res,next) {
    req.db = db;
    next();
});

/** define uris start */
app.use('/', routes);
app.use('/student', student);
app.use('/teacher', teacher);
app.use('/subject', subject);
app.use('/course', course);
app.use('/enrollment', enrollment);
app.use('/attendance', attendance);
/** define uris end */


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.json({
            "code": res.status,
            "message": err.message,
            "error": err
        });

    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        "code": res.status,
        "message": err.message,
        "error": err
    });
});

module.exports = app;
