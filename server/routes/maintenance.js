var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var router = express.Router();

var jsonParser = bodyParser.json();

var maintenance = false;

router.get('/', function(req, res, next) {
    return res.json(builds);
});

router.post('/', jsonParser, function(req, res, next) {
    maintenance = true;
    res.sendStatus(200);
});

router.delete('/', jsonParser, function(req, res, next) {
    maintenance = false;
    res.sendStatus(200);
});

router.get('/status', function(req, res, next) {
    return res.json({
        status: maintenance
    });
});

module.exports = router;
