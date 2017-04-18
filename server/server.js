const express = require('express');
const bodyParser = require('body-parser');

const builds = require('./routes/builds');
const deployments = require('./routes/deployments');
const maintenance = require('./routes/maintenance');
const status = require('./routes/status');

var fs = require('fs');
var https = require('https');
var config = require('./config');

const app = express();

// CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE");
  next();
});

app.use('/', express.static('../client/dist'));

app.use(bodyParser.json());

app.use('/api/v1/builds', builds);
app.use('/api/v1/deployments', deployments);
app.use('/api/v1/maintenance', maintenance);
app.use('/api/v1/status', status);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

function setup(ssl) {
  if (ssl && ssl.active) {
    return {
      key: fs.readFileSync(ssl.key),
      cert: fs.readFileSync(ssl.certificate)
    };
  }
}

function start(app, options) {
  if (options)
    return require('https').createServer(options, app);

  return require('http').createServer(app);
}

var options = setup(config.ssl);

var server = start(app, options).listen(config.port, function () {
  const host = 'localhost';
  const port = server.address().port;
  const scheme = config.ssl.active ? 'https' : 'http';
  console.log('App listening at %s://%s:%s', scheme, host, port);
});

module.exports = app;
