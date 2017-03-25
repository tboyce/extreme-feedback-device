const express = require('express');
const bodyParser = require('body-parser');

const builds = require('./routes/builds');
const deployments = require('./routes/deployments');
const maintenance = require('./routes/maintenance');

const app = express();

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
app.use('/api/v1/maintenance', maintenance);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

let server = app.listen(3000, function() {
    const host = 'localhost';
    const port = server.address().port;
    console.log('App listening at http://%s:%s', host, port);
});

module.exports = app;
