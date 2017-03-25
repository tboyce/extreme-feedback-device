var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');

var router = express.Router();

var jsonParser = bodyParser.json();

var builds = {};

router.get('/', function(req, res, next) {
    return res.json(builds);
});

router.post('/', jsonParser, function(req, res, next) {
    var build = req.body;
    builds[build.resource.definition.id] = build;
    res.sendStatus(200);
});

router.get('/status', function(req, res, next) {
    var failedBuild = _.some(builds, function(b) {
        return b.resource.status === 'failed' &&
          !/test/i.test(b.resource.definition.name);
    });

    var failedTests = _.some(builds, function(b) {
        return b.resource.status === 'failed' &&
          /test/i.test(b.resource.definition.name);
    });
 
    return res.json({buildStatus: failedBuild ? 'failed' : 'success', testStatus: failedTests ? 'failed' : 'success'});
});

module.exports = router;
