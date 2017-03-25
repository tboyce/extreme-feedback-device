var express = require('express');
var bodyParser = require('body-parser');
var _ = require('lodash');
var storage = require('node-persist');

var router = express.Router();

var jsonParser = bodyParser.json();

storage.init().then(function () {
    var storageKey = 'v1/maintenance';
    var maintenance;

    storage.getItem(storageKey).then(function (item) {
        maintenance = item || false;
    });

    router.get('/', function (req, res, next) {
        return res.json(builds);
    });

    router.post('/', jsonParser, function (req, res, next) {
        maintenance = true;
        storage.setItem(storageKey, maintenance);
        res.sendStatus(200);
    });

    router.delete('/', jsonParser, function (req, res, next) {
        maintenance = false;
        storage.setItem(storageKey, maintenance);
        res.sendStatus(200);
    });

    router.get('/status', function (req, res, next) {
        return res.json({
            status: maintenance
        });
    });
});

module.exports = router;
