var express = require('express');
var bodyParser = require('body-parser');

var builds = require('./routes/builds');
var deployments = require('./routes/deployments');

var app = express();

// CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', express.static('../client/dist'));

app.use(bodyParser.json());

app.use('/api/v1/builds', builds);
app.use('/api/v1/deployments', deployments);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

var server = app.listen(3000, function() {
    var host = 'localhost';
    var port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

module.exports = app;
