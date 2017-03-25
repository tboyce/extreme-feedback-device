var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var storage = require('node-persist');

var router = express.Router();

var jsonParser = bodyParser.json();

storage.init().then(function () {
    var storageKey = 'v1/builds';
    var builds;

    storage.getItem(storageKey).then(function (item) {
        builds = item || {};
    });

    router.get('/', function (req, res, next) {
        return res.json(builds);
    });

    router.post('/', jsonParser, function (req, res, next) {
        var build = req.body;
        builds[build.resource.definition.id] = build;
        storage.setItem(storageKey, builds);
        res.sendStatus(200);
    });

    router.delete('/:id', function (req, res, next) {
        delete builds[req.params.id];
        storage.setItem(storageKey, builds);
        res.sendStatus(200);
    });

    router.get('/status', function (req, res, next) {
        var failedBuild = _.some(builds, function (b) {
            return b.resource.status === 'failed' &&
                !(/test/i.test(b.resource.definition.name));
        });

        var failedTests = _.some(builds, function (b) {
            return b.resource.status === 'failed' &&
                (/test/i.test(b.resource.definition.name));
        });

        return res.json({
            buildStatus: failedBuild ? 'failed' : 'success',
            testStatus: failedTests ? 'failed' : 'success'
        });
    });

});

module.exports = router;
