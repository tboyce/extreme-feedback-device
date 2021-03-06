process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require('express');
const bodyParser = require('body-parser');

const builds = require('./routes/builds');
const deployments = require('./routes/deployments');
const maintenance = require('./routes/maintenance');
const status = require('./routes/status');

var fs = require('fs');
var http = require('http');
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
      port: ssl.port,
      key: fs.readFileSync(ssl.key),
      cert: fs.readFileSync(ssl.certificate)
    };
  }
}

var sslOptions = setup(config.ssl);

if (sslOptions) {
  https.createServer(sslOptions, app).listen(sslOptions.port);
}
http.createServer(app).listen(config.port);

module.exports = app;
